#pragma once

#ifndef jsremotestagedbg_h
#define jsremotestagedbg_h

#include <string>
#include "jsapi.h"
#include "httplib/HttpHandler.h"
#include "jsstaging.h"

//#define STG_SERVICE_SERVER_PORT "8086"
//#define STG_SERVICE_SERVER_URL "http://localhost:" STG_SERVICE_SERVER_PORT
//#define STG_DEMO_PAGE STG_SERVICE_SERVER_URL "/Src/staged_dbg/index.html"

using namespace httphandler;
using namespace js;

class RemoteStagedService {
	JSContext *cx;
	JSObject *global;
	HttpHandler httpHandler;
	const char *port;

	JSString *execSrc;
	JSObject *respArray;
	// routes
	static JSBool evaluate(struct mg_connection *conn, void *closures);

	JSBool cleanUp();
 public:
	RemoteStagedService(JSContext *cx, JSObject *global, const char *port);
	JSBool start();

	JSBool setExecSrc(JSString *execSrc);
	JSBool appendStgToRespArray(JSString *resultSrc);
};

#endif 
/* jsremotestagedbg_h */