
#include "json.h"
#include "jsprf.h"
#include "jsremotestagedbg.h"

#define DEBBUGER_PORT "8085"

RemoteStagedDbg::RemoteStagedDbg(JSContext *_cx, JSObject *_ast): 
	cx(_cx), httpHandler(_cx), ast(_ast)
{
	debuggerSourceStmt = JS_NewStringCopyZ(cx, "debugger;\n");
	stagingProcess = StagingProcess::getSingleton();
}

const char *RESP_HAS_NEXT_STAGE_STR = 
	"{ \"msg\": { \"depth\": %u, \"srcCode\": \"%s\", \"inlines\": %u } }";

const char *RESP_NO_NEXT_STAGE_STR = 
	"{ \"msg\": { \"depth\": 0 } }";

const char *RESP_INLINE_STR = 
	"{ \"msg\": { \"inlines\": %u } }";

const char *RESP_CLOSE_SESSION_STR = 
	"{ \"msg\": \"closed\" }";

const char *RESP_SUCCESS_STR = 
	"{ \"msg\": true }";

const char *RESP_FAIL_STR = 
	"{ \"msg\": true }";

static JSBool escapeString(JSContext *cx, JSString *str, JSString **strdest) 
{
	JS::Value *escArg = { &STRING_TO_JSVAL(str) };
	JS::Value escapedVal;
	if(!JS_CallFunctionName(cx, cx->global(), "escape", 1, escArg, &escapedVal))
		return JS_FALSE;

	*strdest = JSVAL_TO_STRING(escapedVal);
	return JS_TRUE;
}

// routes
JSBool RemoteStagedDbg::nextStage(struct mg_connection *conn, void *closures)
{
	RemoteStagedDbg *that = (RemoteStagedDbg *) closures;
	that->inlineHasChange = that->stageHasChange = true;
	uint32_t depth;
	JSString *srcCode = nullptr;
	if(!that->stagingProcess->nextStage(that->ast, &depth, &srcCode))
		return JS_FALSE;

	srcCode = JS_JoinStrings(that->cx, 2, that->debuggerSourceStmt, srcCode);
	JSString *escSrcCode;
	if(!escapeString(that->cx, srcCode, &escSrcCode))
		return JS_FALSE;

	mg_send_header(conn, "Content-Type", "application/json");
	if(depth==0) {
		HttpHandler::response(conn, NULL, RESP_NO_NEXT_STAGE_STR);
	}else {
		char * srcCodeStr = JS_EncodeString( that->cx, escSrcCode );
		HttpHandler::response(conn, NULL, RESP_HAS_NEXT_STAGE_STR, depth, srcCodeStr, 
						that->stagingProcess->getStage().getRemainingInlines());
		js_free(srcCodeStr);
	}

	return JS_TRUE;
}

JSBool RemoteStagedDbg::inspectAst(struct mg_connection *conn, void *closures)
{
	RemoteStagedDbg *that = (RemoteStagedDbg *) closures;

	JSString *astStr = JS_NewStringCopyN( that->cx, conn->content, conn->content_len );
	that->inspectedAst = JS_EncodeString( that->cx, astStr );
	HttpHandler::response(conn, NULL, RESP_SUCCESS_STR);
	return JS_TRUE;
}

JSBool RemoteStagedDbg::execInline(struct mg_connection *conn, void *closures)
{
	RemoteStagedDbg *that = (RemoteStagedDbg *) closures;
	that->inlineHasChange = true;
	size_t bodyLen = conn->content_len;
	
	size_t remainlingIlns = that->stagingProcess->getStage().getRemainingInlines();
	if( remainlingIlns==0 ) {
		HttpHandler::response(conn, NULL, RESP_FAIL_STR);
		return JS_TRUE;
	}
	jschar *bodyStr = InflateUTF8String(that->cx, conn->content, &bodyLen);

	Value jsonVal;
	MutableHandle<Value> jsonValMut = MutableHandle<Value>::fromMarkedLocation(&jsonVal);
	if (!JS_ParseJSON(that->cx, bodyStr, conn->content_len, jsonValMut))
		return JS_FALSE;
	JSObject *inlnArg = jsonValMut.toObjectOrNull();

	if(!that->stagingProcess->executeInline(inlnArg))
		return JS_FALSE;

	remainlingIlns = that->stagingProcess->getStage().getRemainingInlines();

	if( remainlingIlns==0 ) {
		if (!that->stagingProcess->getStage().cutExecs())
			return JS_FALSE;
	}
	HttpHandler::response(conn, NULL, RESP_INLINE_STR, remainlingIlns);
	JSString *srcCode = nullptr;
	if(!(that->stagingProcess->getStage().unparseAst(&srcCode) 
		&& that->stagingProcess->reportResultStaging(srcCode)) 
	)
		return JS_FALSE;
	return JS_TRUE;
}

JSBool RemoteStagedDbg::closeSession(struct mg_connection *conn, void *closures)
{
	RemoteStagedDbg *that = (RemoteStagedDbg *) closures;
	that->httpHandler.stop();
	HttpHandler::response(conn, NULL, RESP_CLOSE_SESSION_STR);
	return JS_TRUE;
}


JSBool RemoteStagedDbg::syncDbgInfo(struct mg_connection *conn, void *closures)
{
	RemoteStagedDbg *that = (RemoteStagedDbg *) closures;

	char * resp = "{ \"msg\": { ";

	if(that->inlineHasChange) {
		size_t remainlingIlns = that->stagingProcess->getStage().getRemainingInlines();
		resp = JS_sprintf_append( NULL, "%s \"inlines\": %u", resp, remainlingIlns );
	}

	if(that->stageHasChange) {
		char *comma = that->inlineHasChange ? "," : "";
		Stage &stage = that->stagingProcess->getStage();

		JSString *escSrcCode;
		if(!escapeString(that->cx, stage.getSrcCode(), &escSrcCode))
			return JS_FALSE;
		char * srcCode = JS_EncodeString( that->cx, escSrcCode );
		resp = JS_sprintf_append( NULL, 
			"%s %s \"stage\": { \"depth\": %u, \"srcCode\": \"%s\" }", 
			resp, comma, stage.getDepth(), srcCode );
	}

	if(that->inspectedAst) {
		char *comma = (that->inlineHasChange || that->stageHasChange ) ? "," : "";
		resp = JS_sprintf_append( NULL, 
			"%s %s \"inspectAst\": %s",
			resp, comma, that->inspectedAst );
	}

	resp = JS_sprintf_append( NULL, "%s } }", resp );
	that->stageHasChange = that->inlineHasChange = false;
	that->inspectedAst = nullptr;
	HttpHandler::responseStr(conn, resp);
	return JS_TRUE;
}



JSBool RemoteStagedDbg::start(const char *preveredBrowser = "chrome")
{
	inspectedAst = nullptr;
	stageHasChange = false;
	inlineHasChange = false;

	JS_ReportInfo(cx, "Debugger staged server started at port '%s'\n", DEBBUGER_PORT);

	httpHandler.setOpt("document_root", ".");
	httpHandler.setOpt("listening_port", DEBBUGER_PORT);

	httpHandler.installRoute(httpRequestHandlerInfo(
		"/nextstage", "application/json", "POST", &nextStage, this)
	);

	httpHandler.installRoute(httpRequestHandlerInfo(
		"/execinline", "application/json", "POST", &execInline, this)
	);

	httpHandler.installRoute(httpRequestHandlerInfo(
		"/inspectast", "application/json", "POST", &inspectAst, this)
	);
	
	httpHandler.installRoute(httpRequestHandlerInfo(
		"/closesession", "application/json", "POST", &closeSession, this)
	);

	httpHandler.installRoute(httpRequestHandlerInfo(
		"/syncdbg", "application/json", "POST", &syncDbgInfo, this)
	);

	char *syssmd = JS_sprintf_append(NULL, "start %s %s", 
			preveredBrowser, STG_DBG_EVALUATOR_PAGE);
	system( syssmd );
	js_free(syssmd);
	syssmd = JS_sprintf_append(NULL, "start %s %s", 
			preveredBrowser, STG_DBG_VISUALIZER_PAGE);
	system( syssmd );
	js_free(syssmd);

	return httpHandler.start();
}