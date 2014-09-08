
////////////////////////////////////////////////////////////////////
#include <iostream>
#include <fstream>
#include <string>

#include "jsreflect.h"
#include "jsapi.h"
#include "js/CallArgs.h"
#include "gc/Marking.h"
#include "jsunparse.h"

#include "frontend/Parser.h"
//#include "frontend/BytecodeEmitter.h"



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

static JSBool
Parse(JSContext *cx, unsigned argc, jsval *vp)
{
    using namespace js::frontend;

    CallArgs args = CallArgsFromVp(argc, vp);

    if (args.length() < 1) {
        JS_ReportErrorNumber(cx, js_GetErrorMessage, NULL, JSMSG_MORE_ARGS_NEEDED,
                             "parse", "0", "s");
        return false;
    }
    if (!args[0].isString()) {
        const char *typeName = JS_GetTypeName(cx, JS_TypeOfValue(cx, args[0]));
        JS_ReportError(cx, "expected string to parse, got %s", typeName);
        return false;
    }

    JSString *scriptContents = args[0].toString();
    CompileOptions options(cx);
    options.setFileAndLine("<string>", 1)
           .setCompileAndGo(false);
	JS_GetStringLength(scriptContents);
    Parser<FullParseHandler> parser(cx, options,
                                    JS_GetStringCharsZ(cx, scriptContents),
                                    JS_GetStringLength(scriptContents),
                                    true, NULL, NULL);
	
    ParseNode *pn = parser.parse(NULL);
    if (!pn)
        return false;
	
	DumpParseTree(pn);

    fputc('\n', stderr);

    args.rval().setUndefined();
    return true;
}

static JSBool
Escape(JSContext *cx, unsigned argc, jsval *vp)
{
	CallArgs args = CallArgsFromVp(argc, vp);
    if (args.length() != 1 || !args[0].isObject()) {
        JS_ReportErrorNumber(cx, js_GetErrorMessage, NULL, JSMSG_MORE_ARGS_NEEDED,
                             "escape", "0", "s");
        return JS_FALSE;
    }

	JSObject *obj = JSVAL_TO_OBJECT(args[0]);
    if (!obj) {
        fprintf(stderr, "NULL\n");
        return JS_FALSE;
    }

	JSString *typeStr;
	if( !JS_GetPropertyToString(cx, obj, "type", &typeStr) )
		return JS_FALSE;
	
	if ( !typeStr->equals("Program") ) {
		JS_ReportError(cx, "object type is not program");
		return JS_FALSE;
	}

	JSObject *bodyObj;
	if( !JS_GetPropertyToObj(cx, obj, "body", &bodyObj) )
		return JS_FALSE;

	if ( !JS_IsArrayObject(cx, bodyObj ) ) {
		JS_ReportError(cx, "object type is not program");
		return JS_FALSE;
	}

	uint32_t lengthp;
	if (!JS_GetArrayLength(cx, bodyObj, &lengthp))
		return JS_FALSE;

	if( lengthp==1 ){
		JSObject *nodeObj;
		if (!JS_GetArrayElementToObj(cx, bodyObj, 0, &nodeObj)){
			JS_ReportError(cx, "array has not index: %d", 0);
			return JS_FALSE;
		}

		JSObject *nodeExpreObj;;
		if( !JS_GetPropertyToObj(cx, nodeObj, "expression", &nodeExpreObj) )
			return JS_FALSE;

		args.rval().setObject(*nodeExpreObj);
	}else{
		args.rval().setNull();
	}

	return JS_TRUE;
}

static JSBool
Inline(JSContext *cx, unsigned argc, jsval *vp)
{
	CallArgs args = CallArgsFromVp(argc, vp);
    if (args.length() != 1 || !args[0].isObject()) {
        JS_ReportErrorNumber(cx, js_GetErrorMessage, NULL, JSMSG_MORE_ARGS_NEEDED,
                             "inline", "0", "s");
        return JS_FALSE;
    }

	JSObject *obj = JSVAL_TO_OBJECT(args[0]);
    if (!obj) {
        fprintf(stderr, "NULL\n");
        return JS_FALSE;
    }

	args.rval().setObject(*obj);

	return JS_TRUE;
}


//////////////////////////// unparse

static JSBool
unParse(JSContext *cx, unsigned argc, jsval *vp)
{
	CallArgs args = CallArgsFromVp(argc, vp);
    if (args.length() != 1 || !args[0].isObject()) {
        JS_ReportErrorNumber(cx, js_GetErrorMessage, NULL, JSMSG_MORE_ARGS_NEEDED,
                             "unparse", "0", "s");
        return JS_FALSE;
    }

	JSObject *obj = JSVAL_TO_OBJECT(args[0]);

    if (!obj) {
        fprintf(stderr, "NULL\n");
        return JS_FALSE;
    }

	JSString *str = NULL;
	unparse up(cx);

	if (!up.unParse_start(obj, &str))
		return JS_FALSE;

	vp->setString(str);

	return JS_TRUE;
}

////////////////////////////////////////////////////////////////////

static const JSFunctionSpecWithHelp builtinFunctions[] = {
	JS_FN_HELP("unparse", unParse, 1, 0,
		"unparse(astObj)",
		"  Unparses a astObject to string, potentially throwing."),
	JS_FN_HELP("parse", Parse, 1, 0,
		"parse(code)",
		"  Parses a string, potentially throwing."),
	JS_FN_HELP("inline", Inline, 1, 0,
		"inline(expr)",
		"  return a javascript ast object that has generated from expr, null otherwise."),
	JS_FN_HELP("escape", Escape, 1, 0,
		"escape(expr)",
		"  return the innet ast of a program ast"),
    JS_FN_HELP(
		"print", 
		Print, 0, 0,
		"print([exp ...])",
		"  Evaluate and print expressions to stdout."
	),
	JS_FS_HELP_END
};

////////////////////////////////////////////////////////////////////


static int readFile( const char *filename, std::string *source){
	std::ifstream file(filename);
	source->assign((std::istreambuf_iterator<char>(file)), 
		std::istreambuf_iterator<char>());

	return 0;
}

static int run (JSContext *cx, const char *source) {
    /* Enter a request before running anything in the context */
    JSAutoRequest ar(cx);

    /* Create the global object in a new compartment. */
    JSObject *global = JS_NewGlobalObject(cx, &global_class, nullptr);
    if (!global)
        return 1;
    /* Set the context's global */
    JSAutoCompartment ac(cx, global);
    JS_SetGlobalObject(cx, global);

	if (!JS_InitReflect(cx, global))
		return 1;
    /* Populate the global object with the standard globals, like Object and Array and builtin functions */
    if (!JS_InitStandardClasses(cx, global)							||
		!JS_DefineFunctionsWithHelp(cx, global, builtinFunctions)	||
        !JS_DefineProfilingFunctions(cx, global))
		return 1;

//============================= START ================================
	uint32_t lineno = 1;
	ScopedJSFreePtr<char> filename;
	uint32_t sourceLen = strlen(source);
	jschar *sourceChar = InflateUTF8String(cx, source, &sourceLen);
	jsval	rval;

	if (!reflect_parse_from_string(cx, sourceChar, sourceLen, &rval))
		return JS_FALSE;

	JS::Value args[] = { rval  };
	JS::Value stringify;
	if (!JS_CallFunctionName(cx, global, "unparse", 1, args, &stringify))
	   return false;

	std::cout << JS_EncodeString(cx, stringify.toString() ) << std::endl;
	
//============================= END =================================

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

	std::string sourceText; 
	readFile("Src/jqueryTest.js", &sourceText);
	
	if (!sourceText.length()){
		std::cout << "File fail\n";
		return 1;
	}
	//std::cout << sourceText <<std::endl;

	int status = run(cx, sourceText.c_str() );

    JS_DestroyContext(cx);
    JS_DestroyRuntime(rt);

    /* Shut down the JS engine. */
    JS_ShutDown();

	system("@pause");
    return status;
}