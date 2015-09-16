
#ifndef staging_h
#define staging_h

#include "jsoptparse.h"
#include "jsapi.h"

using namespace js::cli;

class StagingHandler {
	public:
		virtual int proceedOpts(OptionParser &op) =0;
		virtual int handle(JSContext *cx, JSObject *global, OptionParser &op) =0;
		virtual ~StagingHandler(){};
};

extern int startEngine(int argc, char **argv, char **envp, StagingHandler &ph);

#endif