#include "HttpLib/HttpLib.h"
#include <iostream>
static int destroyServer = 0;
static int event_handler(struct mg_connection *conn, enum mg_event ev) {

  if (ev == MG_AUTH) {
    return MG_TRUE;   // Authorize all requests

  } else if (ev == MG_REQUEST && !strcmp(conn->uri, "/hello")) {
	
    mg_printf_data(conn, "%s", "Hello world");
	destroyServer=1;
    return MG_TRUE;   // Mark as processed

  } else {
    return MG_FALSE;  // Rest of the events are not processed
  }

}

int
main(int argc, char **argv, char **envp)
{
	struct mg_server *server = mg_create_server(NULL, event_handler);
	mg_set_option(server, "listening_port", "8081");  // Open port 8080

	while(destroyServer==0) {
		mg_poll_server(server, 1000);   // Infinite loop, Ctrl-C to stop
	}
	mg_destroy_server(&server);
	system("PAUSE");
	return 0;
}