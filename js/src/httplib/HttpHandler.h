#include "jsapi.h"
#include "HttpLib/HttpLib.h"

using namespace js;
using namespace httpserver;

namespace httphandler {

typedef JSBool (*httpRequestHandler)(struct mg_connection *conn);

struct httpRequestHandlerInfo{
	const char *route;
	const char *contentType;
	const char *method;
	httpRequestHandler requestHandler;

	httpRequestHandlerInfo(
		const char *rt, const char *ct, 
		const char *m, httpRequestHandler rh
	): route(rt), contentType(ct), method(m), requestHandler(rh){};


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
	JSBool start();

};

}// namespace httphandler