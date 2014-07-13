
////////////////////////////////////////////////////////////////////

#include "jsapi.h"
#include "js/CallArgs.h"
#include "gc/Marking.h"

////////////////////////////////////////////////////////////////////

#ifdef	_MSC_VER
#pragma comment(lib, "winmm.lib")
#pragma comment(lib, "psapi.lib")
#endif

using namespace js;

////////////////////////////////////////////////////////////////////

/* The class of the global object. */
static JSClass global_class = { "global",
                                JSCLASS_NEW_RESOLVE | JSCLASS_GLOBAL_FLAGS,
                                JS_PropertyStub,
                                JS_DeletePropertyStub,
                                JS_PropertyStub,
                                JS_StrictPropertyStub,
                                JS_EnumerateStub,
                                JS_ResolveStub,
                                JS_ConvertStub,
                                nullptr,
                                JSCLASS_NO_OPTIONAL_MEMBERS
};

////////////////////////////////////////////////////////////////////

/* The error reporter callback. */
static void reportError (JSContext *cx, const char *message, JSErrorReport *report) {
     fprintf(stderr, "%s:%u:%s\n",
             report->filename ? report->filename : "[no filename]",
             (unsigned int) report->lineno,
             message);
}

////////////////////////////////////////////////////////////////////

static char* JSStringToUTF8 (JSContext *cx, JSString *str)
{
    JSLinearString *linear = str->ensureLinear(cx);
    if (!linear)
        return NULL;

    return TwoByteCharsToNewUTF8CharsZ(cx, linear->range()).c_str();
}

////////////////////////////////////////////////////////////////////

static JSBool PrintInternal (JSContext *cx, const CallArgs &args, FILE *file)
{
    for (unsigned i = 0; i < args.length(); i++) {
        JSString *str = JS_ValueToString(cx, args[i]);
        if (!str)
            return false;
        char *bytes = JSStringToUTF8(cx, str);
        if (!bytes)
            return false;
        fprintf(file, "%s%s", i ? " " : "", bytes);
#if JS_TRACE_LOGGING
        TraceLog(TraceLogging::defaultLogger(), bytes);
#endif
        JS_free(cx, bytes);
    }

    fputc('\n', file);
    fflush(file);

    args.rval().setUndefined();
    return true;
}

////////////////////////////////////////////////////////////////////

static JSBool Print(JSContext *cx, unsigned argc, jsval *vp) {
    CallArgs args = CallArgsFromVp(argc, vp);
    return PrintInternal(cx, args, stdout);
}

////////////////////////////////////////////////////////////////////

static const JSFunctionSpecWithHelp builtinFunctions[] = {
    JS_FN_HELP(
		"print", 
		Print, 0, 0,
		"print([exp ...])",
		"  Evaluate and print expressions to stdout."
	),
	JS_FS_HELP_END
};

////////////////////////////////////////////////////////////////////

static int run (JSContext *cx) {
    /* Enter a request before running anything in the context */
    JSAutoRequest ar(cx);

    /* Create the global object in a new compartment. */
    JSObject *global = JS_NewGlobalObject(cx, &global_class, nullptr);
    if (!global)
        return 1;

    /* Set the context's global */
    JSAutoCompartment ac(cx, global);
    JS_SetGlobalObject(cx, global);

    /* Populate the global object with the standard globals, like Object and Array and builtin functions */
    if (!JS_InitStandardClasses(cx, global)							||
		!JS_DefineFunctionsWithHelp(cx, global, builtinFunctions)	||
        !JS_DefineProfilingFunctions(cx, global))
		return 1;

    /* Your application code here. This may include JSAPI calls to create your own custom JS objects and run scripts. */

	jsval	rval;
	JSBool	ok;
	char *source = "x = Math.abs(10.5); print(x);";
	ok = JS_EvaluateScript(
		cx, 
		global, 
		source, 
		strlen(source),
		"test.js", 
		1, 
		&rval
	);

    return 0;
}

////////////////////////////////////////////////////////////////////

int main(int argc, const char *argv[]) {

    /* Create a JS runtime. */
    JSRuntime *rt = JS_NewRuntime(8L * 1024L * 1024L, JS_NO_HELPER_THREADS);
    if (!rt)
       return 1;

    /* Create a context. */
    JSContext *cx = JS_NewContext(rt, 8192);
    if (!cx)
       return 1;
    JS_SetOptions(cx, JSOPTION_VAROBJFIX);
    JS_SetErrorReporter(cx, reportError);

    int status = run(cx);

    JS_DestroyContext(cx);
    JS_DestroyRuntime(rt);

    /* Shut down the JS engine. */
    JS_ShutDown();

	system("@pause");
    return status;
}