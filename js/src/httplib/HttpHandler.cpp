#include <algorithm>
#include <functional>
#include <sstream>  
#include <string> 
#include <ctime>
#include <iostream>

#include "vm\StringBuffer.h"
#include "jsprf.h"
#include "HttpHandler.h"


#define POLLING_INTERVAL_MS 1000

const char *RESP_OPTIONS_ALLOW_ORIGIN_STR = "Allow: CONVERT";

using namespace httphandler;
using namespace std;

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
		if(contentType) {
			if(!strstr(contentType, reqhandler.contentType))
			return false;
		}
		return !strcmp(reqhandler.route, route)
			&& !strcmp(reqhandler.method, method);
	}
};

int HttpHandler::EventHandler(struct mg_connection *conn, enum mg_event ev) {

  if (ev == MG_AUTH) {
    return MG_TRUE;   // Authorize all requests
  } else if (ev == MG_REQUEST) {
	const char *route = conn->uri;
	bool enableLog = strcmp( route, "/syncdbg" ) && strcmp( route, "/favicon.ico" ) && !strstr( route, ".map" );
	if( enableLog ) {
		time_t t = time(0);   
    struct tm *now = localtime(&t);
		cout << (now->tm_year + 1900) << '/' << (now->tm_mon + 1) << '/' <<  now->tm_mday 
					<< " " << now->tm_hour << ":" << now->tm_min << ", " << route << "\n";
	}
	
	mg_send_header(conn, "Access-Control-Allow-Origin", "*");
	mg_send_header(conn, "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	mg_send_header(conn, "Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length");

	const char *contentType = mg_get_header(conn, "Content-Type");
	const char *method = conn->request_method;
	if( !strcmp(method, "OPTIONS") ) {
		cout << "Access-Control-Allow-Origin" << "\n";
		HttpHandler::response(conn, NULL, RESP_OPTIONS_ALLOW_ORIGIN_STR);
		return MG_TRUE;
	}
	if( !route || !method ) {
		if( enableLog ) {
			cout << "fail" << "\n";
		}
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
		if( enableLog ) {
			cout << "fail" << "\n";
		}
		return MG_FALSE;
	}
	if(!itehandlerIter->requestHandler(conn, itehandlerIter->closures)) {
		that->stop(true);
		if( enableLog ) {
			cout << "fail" << "\n";
		}
		return MG_FALSE;
	}


    return MG_TRUE;   // Mark as processed

  } else {
    return MG_FALSE;  // Rest of the events are not processed
  }

}

void HttpHandler::response(struct mg_connection *conn, char *last, const char *fmt, ...)
{
    va_list ap;
    
    va_start(ap, fmt);
    char *body = JS_vsprintf_append(last, fmt, ap);
    va_end(ap);

	HttpHandler::responseStr(conn, body);

	js_free(body);
}

void HttpHandler::responseStr(struct mg_connection *conn, char *body)
{
	size_t bodylen = strlen(body);
	std::ostringstream ostr;
	ostr << bodylen;
	std::string theNumberString = ostr.str();
	mg_send_header(conn, "Content-Length", theNumberString.c_str());
	mg_send_data(conn, body, bodylen);
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

void HttpHandler::stop(bool errorOccurred)
{
	this->errorOccurred = errorOccurred;
	this->isServerRunning = false;
}