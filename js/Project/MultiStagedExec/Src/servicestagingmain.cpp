#include "jsoptparse.h"
#include "jscorestaging.h"
#include "jsunparse.h"
#include "jsremotestagedservice.h"


#include <iostream>

using namespace JS;
using namespace js;
using namespace js::cli;

#define STG_DEFAULT_SERVICE_SERVER_PORT "8086"

class ServiceStagingHandler : public StagingHandler
{
	public:
		ServiceStagingHandler(){};
		~ServiceStagingHandler(){};

		virtual int proceedOpts(OptionParser &op) { 
			op.setDescription("Metaprogramming Multi-Staged JavaScript Web Serice");

			if (!op.addStringOption('\0', "port", "port", "Web server port")){
					return EXIT_FAILURE;
			}
			return EXIT_SUCCESS; 
		}
		virtual int handle(JSContext *cx, JSObject *global, OptionParser &op){
			const char *port = op.getStringOption("port");
			if(!port) {
				port = STG_DEFAULT_SERVICE_SERVER_PORT;
			}
			RemoteStagedService remoteStagedservice(cx, global, port);
			remoteStagedservice.start();
			return EXIT_SUCCESS;
	}
};

#ifdef JS_STAGEDJS_SERVICE
int
main(int argc, char **argv, char **envp)
{
	ServiceStagingHandler ssh;
	return startEngine(argc, argv, envp, ssh);
}
#endif