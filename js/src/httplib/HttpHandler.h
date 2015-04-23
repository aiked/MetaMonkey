#pragma once

#ifndef httphandler_h
#define httphandler_h

#include "jsapi.h"
#include "HttpLib/HttpLib.h"

using namespace js;
using namespace httpserver;

namespace httphandler {

typedef JSBool (*httpRequestHandler)(struct mg_connection *conn, void *closures);

struct httpRequestHandlerInfo{
	const char *route;
	const char *contentType;
	const char *method;
	void *closures;
	httpRequestHandler requestHandler;

	httpRequestHandlerInfo(
		const char *rt, const char *ct, 
		const char *m, httpRequestHandler rh, void *cls
	): route(rt), contentType(ct), method(m), requestHandler(rh), closures(cls){};
};

typedef Vector<httpRequestHandlerInfo> httpRequestHandlersInfo;

class HttpHandler {
  private:
	JSContext *cx;

	struct mg_server *server;
	bool isServerRunning;
	bool errorOccurred;

  public: 
	httpRequestHandlersInfo reqHandlersInf;
	HttpHandler(JSContext *cx);
	HttpHandler *setOpt(const char *key, const char *val);
	void installRoute(const httpRequestHandlerInfo& handler);
	static int EventHandler(struct mg_connection *, enum mg_event);
	static void response(struct mg_connection *conn, char *last, const char *fmt, ...);
	static void responseStr(struct mg_connection *conn, char *str);
	JSBool start();
	void stop(bool errorOccurred=false);

};

}// namespace httphandler

#endif 
/* httphandler_h */