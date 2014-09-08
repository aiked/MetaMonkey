
////////////////////////////////////////////////////////////////////
#include <iostream>

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

	jsval typeVal;
	if (!JS_GetProperty(cx, obj, "type", &typeVal)){
		JS_ReportError(cx, "object has not property (%s)", "type");
		return JS_FALSE;
	}

	JSString *typeStr = JS_ValueToString(cx, typeVal);
	if (!typeStr){
		JS_ReportError(cx, "cannot convert value to string");
		return JS_FALSE;
	}
	
	if ( !typeStr->equals("Program") ) {
		JS_ReportError(cx, "object type is not program");
		return JS_FALSE;
	}

	args.rval().setBoolean(true);
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
	//printf("\n=============obj dump================\n\n\n");
	//obj->dump();
	//printf("\n=============our dump :)============================\n\n\n");
	//JSString *ourDump;
	//up.stringifyObject(obj, &ourDump);
	//fprintf(stderr,"%s", JS_EncodeString(cx,ourDump));
	//printf("\n=============================================\n\n\n");
	if (!up.unParse_start(obj, &str))
		return JS_FALSE;

	if( str && str->length() != 0 )
		str->dumpChars(str->getChars(cx), str->length(), false);
	//fprintf(stderr, objType.toString()->getChars() );
	
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

	if (!JS_InitReflect(cx, global))
		return 1;

    /* Populate the global object with the standard globals, like Object and Array and builtin functions */
    if (!JS_InitStandardClasses(cx, global)							||
		!JS_DefineFunctionsWithHelp(cx, global, builtinFunctions)	||
        !JS_DefineProfilingFunctions(cx, global))
		return 1;

    /* Your application code here. This may include JSAPI calls to create your own custom JS objects and run scripts. */



//============================= JAST START ================================

	uint32_t lineno = 1;
	ScopedJSFreePtr<char> filename;
	const char *quaziSnippet =  "function foo(){ y=.<3;>.; x= .< 2; >.; ast = .< .~y + .~x; >.; /* ast = {type:'Program', body:[{ type:'ExpressionStatement', expression:{type:'BinaryExpression', operator:'+', left:y.body[0].expression, right:x.body[0].expression}}]};*/ return .< 1; >.; } x = .! foo();";
	//const char *quaziSnippet =  "function foo(){ return .< .~y + .~x; >.; } x = .! foo();";
	uint32_t quaziSnippetLength = strlen(quaziSnippet);
	jschar *jsQuaziSnippet = InflateUTF8String(cx, quaziSnippet, &quaziSnippetLength);
	jsval	rval;
	if (!reflect_parse_from_string(cx, jsQuaziSnippet, quaziSnippetLength, &rval))
		return JS_FALSE;

	JS::Value args[] = { rval  };
	JS::Value stringlify;
	if (!JS_CallFunctionName(cx, global, "unparse", 1, args, &stringlify))
	   return false;

//============================= JAST END ================================

//============================= JAST TEST START =========================
	//uint32_t lineno = 1;
	//ScopedJSFreePtr<char> filename;

	//const char* tests[] = { 
//"x;"
//,"null;"
//,"true;"
//,"false;"
//,"-0;"
//,"x = y;"
//,"void 0;"
//,"void y;"
//,"void f();"
//,"[];"
//,"({});"
//,"({1e999: 0});"
//,"({get \"a b\"() {    return this;}});"
//,"({get 1() {    return this;}});"
//,"[,, 2];"
//,"[, 1,,];"
//,"[1,,, 2,,,];"
//,"[,,,];"
//,"[0, 1, 2, \"x\"];"
//,"x.y.z;"
//,"x[y[z]];"
//,"x[\"y z\"];"
//,"(0).toString();"
//,"f()();"
//,"f((x, y));"
//,"f(x = 3);"
//,"x.y();"
//,"f(1, 2, 3, null, (g(), h));"
//,"new (x.y);"
//,"new (x());"
//,"(new x).y;"
//,"new (x().y);"
//,"a * x + b * y;"
//,"a * (x + b) * y;"
//,"a + (b + c);"
//,"a + b + c;"
//,"x.y = z;"
//,"get(id).text = f();"
//,"[,] = x;"
//,"x = 1e999 + y;"
//,"x = y / -1e999;"
//,"x = 0 / 0;"
//,"x = (-1e999).toString();"
//,"if (a == b)    x();else    y();"
//,"if (a == b) {    x();} else {    y();}"
//,"if (a == b)    if (b == c)        x();    else        y();"
//,"while (a == b)    c();"
//,"if (a)    while (b)        ;else    c();"
//,"if (a)    while (b) {        ;    }else    c();"
//,"for (;;)    ;"
//,"for (var i = 0; i < a.length; i++) {    b[i] = a[i];}"
//,"for (t = (i in x); t; t = t[i])    ;"
//,"for (var t = (i in x); t; t = t[i])    ;"
//,"for (t = 1 << (i in x); t < 100; t++)    ;"
//,"for (var i in arr)    dump(arr[i]);"
//,"for ([k, v] in items(x))    dump(k + \": \" + v);" 
//,"if (x) {    switch (f(a)) {    case f(b):    case \"12\":        throw exc;    default:        fall_through();    case 99:        succeed();    }}"
//,"var x;"
//,"var x, y;"
//,"var x = 1, y = x;"
//,"var x = y = 1;"
//,"var x = f, g;"
//,"var x = (f, g);"
//,"var [x] = a;"
//,"var [] = x;"
//,"var [, x] = y;"
//,"var [[a, b], [c, d]] = x;"
//,"var {} = x;"
//,"var {x: x} = x;"
//,"var {x: a, y: b} = x;"
//,"var {1: a, 2: b} = x;"
//,"var {1: [], 2: b} = x;"
//,"var {\"a b\": x} = y;"
//,"const a = 3;"
//,"try {    f();} finally {    cleanup();}"
//,"try {    f();} catch (x) {    cope(x);} finally {    cleanup();}"
//,"function f() {    g();}"
//,"\"use strict\";x = 1;"
//,"function f() {    \"use strict\";    x = 1;}"
//,"(function () {    \"use strict\";    x = 1;});"
//,"(function () {    go();}());"
//,"(function () {}.x);"
//,"(function name() {}.x);"
//,"(function () {}.x = 1);"
//,"(function name() {}.x = 1);"
//,"(function () {}.x, function () {}.y);"
//,"(function () {} + x) * y;"
//,"(function () {} * x + y);"
//,"({a: f()});"
//,"({a: my_a} = f());"
//,"options(\"tracejit\");try {} catch (e) {}"
//,"function test() {    var s1 = evalcx(\"lazy\");    expect = function () {        test();    }(s1);}"
//,"try {    var a = new Array(100000);    var i = a.length;    new i(eval(\"var obj = new Object(); obj.split = String.prototype.split;\"));} catch (e) {}"
//,"test3();function test3() {    try {        eval(\"for(var y in ['', ''])\");    } catch (ex) {    }    new test3;}    new test3;"
//,"e=[]; for(i=0; i<tests.length; ++i) e[i] ='\"' + tests[i].replace(/(\\r\\n|\\n|\\r)/gm, '').replace(/(\\\")*/, '\\\"') + '\"\\n'; e.join()", "" <- ... regular expression is empty
	//	"replace(/(\\r\\n|\\n|\\r)/gm); q ='asdas';"	
	//};

	//int testsLen = sizeof(tests)/sizeof(tests[0]);

	//for(int i=0; i<testsLen; ++i){
	//	const char * test = "x = {t:2, r:'hi', x:20};";
	//	uint32_t testLen = strlen(tests[i]);
	//	jschar *testChars = InflateUTF8String(cx, tests[i], &testLen);
	//	jsval	rval;
	//	
	//	printf("=========== initial string =====================\n");
	//	printf("%s",tests[i]);
	//	printf("\n=========== generated string =====================\n");
	//	
	//	if (!reflect_parse_from_string(cx, testChars, testLen, &rval)){
	//		printf("error: reflect_parse_from_string failed @ MAIN\n");
	//		return JS_FALSE;
	//	}

	//	JS::Value args[] = { rval  };
	//	JS::Value stringlify;
	//	if (!JS_CallFunctionName(cx, global, "unparse", 1, args, &stringlify))
	//	   return false;

	//	printf("\n==================================================\n\n\n");
	//}

//============================= JAST TEST END ============================
	//jsval	rval;
	//JSBool	ok;

	//std::cout << "\n\n_________________________________\n";

	//char *source = "print(JSON.stringify( Reflect.parse('x = .< .< 1; >.; >.;') ) );";
	////char *source = "Reflect.parse('x=1+print(5);');";
	//frontend::metaBeginParse::markAsStart();
	//ok = JS_EvaluateScript(
	//	cx, 
	//	global, 
	//	source, 
	//	strlen(source),
	//	"test.js", 
	//	1, 
	//	&rval
	//);
	//std::cout << "\n_________________________________\n";


//============================= Check json.stringify START ================================

	//const char *quaziSnippet =  "{t:3,q:'s', obj:{o:[]}}";

	//JSString *quaziStr = JS_NewStringCopyZ(cx, quaziSnippet);
	//jsval quaziVal = STRING_TO_JSVAL(quaziStr);

	//jsval stringifyProp;
	//if (!JS_GetProperty(cx, global, "JSON", &stringifyProp)){
	//	JS_ReportError(cx, "object has not property (%s)", "JSON");
	//	return JS_FALSE;
	//}

	//JSObject *stringifyObj;
	//if( !JS_ValueToObject(cx, stringifyProp, &stringifyObj) ){
	//	JS_ReportError(cx, "object property (%s) is not an object", "JSON");
	//	return JS_FALSE;
	//}

	//JS::Value args[] = { quaziVal  };
	//JS::Value stringlify;
	//if (!JS_CallFunctionName(cx, stringifyObj, "stringify", 1, args, &stringlify))
	//   return false;

	//JSString *stringlifyStr = JS_ValueToString(cx, stringlify);
	//std::cout << JS_EncodeString(cx, stringlifyStr);
//============================= Check json.stringify END ================================

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