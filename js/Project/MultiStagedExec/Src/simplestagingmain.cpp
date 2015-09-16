#include "jscorestaging.h"
#include "jsstaging.h"
#include "jsunparse.h"

#include <iostream>

using namespace JS;
using namespace js;
using namespace js::cli;

class SimpleStagingHandler : public StagingHandler
{
	public:
		SimpleStagingHandler(){};
		~SimpleStagingHandler(){};

		virtual int proceedOpts(OptionParser &op) {
			op.setDescription("Metaprogramming Multi-Staged JavaScript");

			if (!op.addStringOption('i', "inputfile", "filepath",
						"Metaprogramming JavaScript input File location")
					|| !op.addStringOption('o', "outputfile", "filepath",
						"Metaprogramming JavaScript output File location")){
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
				fprintf(stderr, "Unrecognized option for %s: %s\n", "inputfile", stgOutputfile);
				return EXIT_FAILURE;
			}
	
	/*		stgInputfile = "Src/examples/test.js";
				stgOutputfile = "Src/examples/test_staged.js";
	*/
			StagingProcess::createSingleton(cx, stgInputfile, NULL);
			unparse *up = unparse::getSingleton();

			JS_ReportInfo(cx, "opening \"%s\".\n", stgOutputfile);

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


		//============================= START ================================


			JS_ReportInfo(cx, "converting ast to src.\n");
			JS::Value args[] = { rval  };
			JS::Value stringify;
			if (!JS_CallFunctionName(cx, global, "unparse", 1, args, &stringify)){
				JS_ReportError(cx, "unparse error\n");
				return EXIT_FAILURE;
			}
			JS_ReportInfo(cx, "done.\n", stgOutputfile);

		//============================= END =================================
			JS_ReportInfo(cx, "saving \"%s\".\n", stgOutputfile);
			if (!JS::AutoFile::OpenAndWriteAll(cx, stgOutputfile, stringify.toString()))
				return EXIT_FAILURE;

			js_free(chars);
			StagingProcess::destroySingleton();
			JS_ReportInfo(cx, "finish.\n");
			return EXIT_SUCCESS;
	}
};

#ifdef JS_STAGEDJS
int
main(int argc, char **argv, char **envp)
{
	SimpleStagingHandler ssh;
	return startEngine(argc, argv, envp, ssh);
}
#endif