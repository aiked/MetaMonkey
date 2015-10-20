
#include "jsapi.h"
#include "json.h"
#include "jsprf.h"
#include "jsstaging.h"
#include "jsremotestagedservice.h"

#define STG_RECEIVE_SRC_SIZE 100000

const char *RESP_SUCCESS_STR = 
	"{ \"success\": true, \"msg\": %s }";
const char *RESP_FAIL_STR = 
	"{ \"success\": false, \"msg\": { \"code\": %d, \"desc\": \"%s\" }  }";

#define ERR_CODE_GENERAL 100
#define ERR_CODE_INVALID_ARGS 200
#define ERR_CODE_REFLECT_PARSE 201

jschar jsSrcBuffer[STG_RECEIVE_SRC_SIZE];
size_t jsSrcBufferSize = 0;

class RemoteServiceStagingProcessReporter: public StagingProcessReporter
{
	private:
	RemoteStagedService *remstgserv;

	public:
	RemoteServiceStagingProcessReporter(RemoteStagedService *_remstgserv):remstgserv(_remstgserv){}

	virtual JSBool reportExec(JSString *srcCode)
	{
		return remstgserv->setExecSrc(srcCode);
	}

	virtual JSBool reportResult(JSString *srcCode)
	{
		return remstgserv->appendStgToRespArray(srcCode);
	}

	virtual ~RemoteServiceStagingProcessReporter(){}
};

RemoteStagedService::RemoteStagedService(JSContext *_cx, JSObject *_global, const char *_port): 
	cx(_cx), global(_global), port(_port), httpHandler(_cx)
{
	respArray = JS_NewArrayObject(_cx, 0, NULL);
	cleanUp();
}

JSBool onJSONStringifyFinished(const jschar *buf, uint32_t len, void *data)
{
	jsSrcBufferSize = len;
	js_strncpy(jsSrcBuffer, buf, len);
	return JS_TRUE;
}

JSBool RemoteStagedService::cleanUp()
{
	execSrc = 0;
	jsSrcBufferSize = 0;
	return JS_SetArrayLength(cx, this->respArray, 0);
}

JSBool RemoteStagedService::setExecSrc(JSString *execSrc)
{
	JSString *execSrcEsc;
	if(!JS_EscapedString(this->cx, execSrc, &execSrcEsc))
		return JS_FALSE;
	this->execSrc = execSrcEsc;
	return JS_TRUE;
}

JSBool RemoteStagedService::appendStgToRespArray(JSString *resultSrc)
{
	JSObject *stgRepObj = JS_NewObject(this->cx, 0, 0, 0);
	if (!JS_SetProperty(cx, stgRepObj, "exec", &STRING_TO_JSVAL(this->execSrc)))
		return JS_FALSE;
	JSString *resultSrcEsc;
	if(!JS_EscapedString(this->cx, resultSrc, &resultSrcEsc))
		return JS_FALSE;
	if (!JS_SetProperty(cx, stgRepObj, "result", &STRING_TO_JSVAL(resultSrcEsc)))
		return JS_FALSE;
	if (!JS_ArrayObjPush(cx, this->respArray, &OBJECT_TO_JSVAL(stgRepObj)))
		return JS_FALSE;

	return JS_TRUE;
}

JSBool RemoteStagedService::evaluate(struct mg_connection *conn, void *closures)
{
	RemoteStagedService *that = (RemoteStagedService *) closures;
	mg_send_header(conn, "Content-Type", "application/json");
	if(!that->cleanUp())
	{
		HttpHandler::response(conn, NULL, RESP_FAIL_STR, ERR_CODE_GENERAL, "cleanUp");
		return JS_TRUE;
	}

	if(!(conn->query_string && (strlen(conn->query_string)<STG_RECEIVE_SRC_SIZE))) {
		HttpHandler::response(conn, NULL, RESP_FAIL_STR, ERR_CODE_INVALID_ARGS, "");
		return JS_TRUE;
	}

	JSString *queryStr = JS_InternString(that->cx, conn->query_string + 4);
	JSString *queryEscStr;
	if(!JS_UnescapedString(that->cx, queryStr, &queryEscStr))
	{
		HttpHandler::response(conn, NULL, RESP_FAIL_STR, ERR_CODE_GENERAL, "unescapeString");
		return JS_TRUE;
	}

	char *queryEscChars = JS_EncodeString(that->cx, queryEscStr);
	jsSrcBufferSize = STG_RECEIVE_SRC_SIZE;
	if(!JS_DecodeBytes(that->cx, queryEscChars, strlen(queryEscChars), jsSrcBuffer, &jsSrcBufferSize)) 
	{
		HttpHandler::response(conn, NULL, RESP_FAIL_STR, ERR_CODE_GENERAL, "JS_DecodeBytes");
		return JS_TRUE;
	}

	jsval parseVal;
	if (!reflect_parse_from_string(that->cx, jsSrcBuffer, jsSrcBufferSize, &parseVal))
	{
		HttpHandler::response(conn, NULL, RESP_FAIL_STR, ERR_CODE_REFLECT_PARSE, "reflection parse error");
		return JS_TRUE;
	}

	JS::Value unparseArgs[] = { parseVal  };
	JS::Value unparseRes;
	if (!JS_CallFunctionName(that->cx, that->global, "unparse", 1, unparseArgs, &unparseRes)){
		HttpHandler::response(conn, NULL, RESP_FAIL_STR, ERR_CODE_GENERAL, "unparse");
		return JS_TRUE;
	}

	JS::Value *stringifyArg = { &OBJECT_TO_JSVAL(that->respArray) };
	if(!JS_Stringify(that->cx, stringifyArg, 0, js::NullValue(), onJSONStringifyFinished, 0)) 
	{
		HttpHandler::response(conn, NULL, RESP_FAIL_STR, ERR_CODE_GENERAL, "JS_Stringify");
		return JS_TRUE;
	}

	char srcBuffer[STG_RECEIVE_SRC_SIZE];
	size_t srcBufferSize=STG_RECEIVE_SRC_SIZE;
  if (!DeflateStringToBuffer(that->cx, jsSrcBuffer, jsSrcBufferSize, srcBuffer, &srcBufferSize)) 
	{
		HttpHandler::response(conn, NULL, RESP_FAIL_STR, ERR_CODE_GENERAL, "DeflateStringToBuffer");
		return JS_TRUE;
  }
	srcBuffer[srcBufferSize] = 0;

	HttpHandler::response(conn, NULL, RESP_SUCCESS_STR, srcBuffer);
	return JS_TRUE;
}

JSBool RemoteStagedService::start()
{
	StagingProcess::createSingleton(cx, NULL, NULL);
	StagingProcess *stgproc = StagingProcess::getSingleton();

	RemoteServiceStagingProcessReporter remoteServStgProc(this);
	stgproc->setStagingReporter(&remoteServStgProc);

	JS_ReportInfo(cx, "Staged server service started at port '%s'\n", port);
	httpHandler.setOpt("document_root", ".");
	httpHandler.setOpt("listening_port", port);

	httpHandler.installRoute(httpRequestHandlerInfo(
		"/eval", 0, "GET", &evaluate, this)
	);

	JSBool res = httpHandler.start();
	StagingProcess::destroySingleton();

	return res;
}