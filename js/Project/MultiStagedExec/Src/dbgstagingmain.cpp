#include "jsoptparse.h"
#include "jscorestaging.h"
#include "jsstaging.h"
#include "jsunparse.h"
#include "jsremotestagedbg.h"

#include <iostream>

using namespace JS;
using namespace js;
using namespace js::cli;

class DbgStagingHandler : public StagingHandler
{
	public:
		DbgStagingHandler(){};
		~DbgStagingHandler(){};

		virtual int proceedOpts(OptionParser &op) {
			op.setDescription("Metaprogramming Multi-Staged JavaScript Debugger");

			if (!op.addStringOption('i', "inputfile", "filepath",
						"Metaprogramming JavaScript input File location")
					|| !op.addStringOption('o', "outputfile", "filepath",
						"Metaprogramming JavaScript output File location")
					|| !op.addStringOption('b', "browser", "browser execution location",
						"Metaprogramming JavaScript execution browser")){
					return EXIT_FAILURE;
			}
			return EXIT_SUCCESS;
		}

		virtual int handle(JSContext *cx, JSObject *global, OptionParser &op){

			const char *stgInputfile = op.getStringOption("inputfile");
			if(!stgInputfile) {
				fprintf(stderr, "Unrecognized option for %s: %s\n", "inputfile", stgInputfile);
				return EXIT_FAILURE;
			}
			const char *stgOutputfile = op.getStringOption("outputfile");
			if(!stgOutputfile) {
				fprintf(stderr, "Unrecognized option for %s: %s\n", "outputfile", stgOutputfile);
				return EXIT_FAILURE;
			}
			const char *stgBrowser = op.getStringOption("browser");
			if(!stgBrowser) {
				fprintf(stderr, "Unrecognized option for %s: %s\n", "browser", stgBrowser);
				return EXIT_FAILURE;
			}
	
	/*		stgInputfile = "Src/examples/test.js";
				stgOutputfile = "Src/examples/test_staged.js";
				stgBrowser = "chrome";
	*/

		StagingProcess::createSingleton(cx, stgOutputfile, NULL);
		unparse *up = unparse::getSingleton();

		JS_ReportInfo(cx, "opening \"%s\".\n", stgInputfile);

		jschar *chars;
		if (!AutoFile::OpenAndReadAll(cx, stgInputfile, &chars))
			return EXIT_FAILURE;

		uint32_t lineno = 1;
		ScopedJSFreePtr<char> filename;
		jsval rval;

		JS_ReportInfo(cx, "converting src to ast. ");
		if (!reflect_parse_from_string(cx, chars, js_strlen(chars), &rval)){
			JS_ReportError(cx, "reflection parse error.\n");
			return EXIT_FAILURE;
		}
		JS_ReportInfo(cx, "done.\n");

		RemoteStagedDbg remoteStagedDbg(cx, JSVAL_TO_OBJECT(rval));
		remoteStagedDbg.start(stgBrowser);

		js_free(chars);
		StagingProcess::destroySingleton();
		JS_ReportInfo(cx, "finish.\n");
		return EXIT_SUCCESS;
	}
};

#ifdef JS_STAGEDJS_DBG
int
main(int argc, char **argv, char **envp)
{
	DbgStagingHandler ssh;
	return startEngine(argc, argv, envp, ssh);
}
#endif