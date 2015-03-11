#include <algorithm>
#include <functional>
#include "HttpHandler.h"


#define POLLING_INTERVAL_MS 1000

using namespace httphandler;

struct MatchRequestRoute {
	const char *route;
	const char *contentType;
	const char *method;

	MatchRequestRoute(
		const char *rt, const char *ct, 
		const char *m
	): route(rt), contentType(ct), method(m){}

	bool operator()(const httpRequestHandlerInfo &reqhandler)
	{
		return !strcmp(reqhandler.contentType, contentType)
			&& !strcmp(reqhandler.route, route)
			&& !strcmp(reqhandler.method, method);
	}
};

int HttpHandler::EventHandler(struct mg_connection *conn, enum mg_event ev) {

  if (ev == MG_AUTH) {
    return MG_TRUE;   // Authorize all requests
  } else if (ev == MG_REQUEST) {
	const char *route = conn->uri;
	const char *contentType = mg_get_header(conn, "Content-Type");
	const char *method = conn->request_method;
	if( !route || !contentType || !method ) {
		return MG_FALSE;
	}

	HttpHandler *that = (HttpHandler*) conn->server_param;

	httpRequestHandlersInfo &reqHandlersInf = that->reqHandlersInf;
	httpRequestHandlerInfo *itehandlerIter = std::find_if(
		reqHandlersInf.begin(), 
		reqHandlersInf.end(), 
		MatchRequestRoute( route, contentType, method )
	);
	if( itehandlerIter == reqHandlersInf.end() ) {
		return MG_FALSE;
	}
	if(!itehandlerIter->requestHandler(conn)) {
		that->errorOccurred = true;
		that->isServerRunning = false;
		return MG_FALSE;
	}

    return MG_TRUE;   // Mark as processed

  } else {
    return MG_FALSE;  // Rest of the events are not processed
  }

}

HttpHandler::HttpHandler(JSContext *_cx): cx(_cx), 
	reqHandlersInf(_cx), isServerRunning(false), errorOccurred(false)
{
	server = mg_create_server(this, &HttpHandler::EventHandler);
}


HttpHandler *HttpHandler::setOpt(const char *key, const char *val)
{
	mg_set_option(server, key, val);
	return this;
}

void HttpHandler::installRoute(const httpRequestHandlerInfo &handler)
{
	reqHandlersInf.append(handler);
}

JSBool HttpHandler::start()
{
	isServerRunning = true;
	while(isServerRunning) {
		mg_poll_server(server, POLLING_INTERVAL_MS);   // Infinite loop, Ctrl-C to stop
	}
	mg_destroy_server(&server);
	return errorOccurred;
}