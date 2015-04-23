#pragma once

#ifndef jsremotestagedbg_h
#define jsremotestagedbg_h

#include <string>
#include "jsapi.h"
#include "httplib/HttpHandler.h"
#include "jsstaging.h"

#define STG_DBG_SERVER_URL "http://localhost:8085"
#define STG_DBG_EVALUATOR_PAGE STG_DBG_SERVER_URL "/Src/staged_dbg/stageddbgevaluator/index.html"
#define STG_DBG_VISUALIZER_PAGE STG_DBG_SERVER_URL "/Src/staged_dbg/stageddbgvisualizer/index.html"

using namespace httphandler;
using namespace js;

class RemoteStagedDbg {
	JSContext *cx;
	HttpHandler httpHandler;
	StagingProcess *stagingProcess;
	JSObject *ast;
	JSString *debuggerSourceStmt;

	// visualizer unread flags
	char *inspectedAst;
	bool stageHasChange;
	bool inlineHasChange;

	// routes
	static JSBool nextStage(struct mg_connection *conn, void *closures);
	static JSBool execInline(struct mg_connection *conn, void *closures);
	static JSBool inspectAst(struct mg_connection *conn, void *closures);
	static JSBool closeSession(struct mg_connection *conn, void *closures);

	static JSBool syncDbgInfo(struct mg_connection *conn, void *closures);

 public:
	RemoteStagedDbg(JSContext *cx, JSObject *ast);
	JSBool start(const char *preveredBrowser);
};

#endif 
/* jsremotestagedbg_h */