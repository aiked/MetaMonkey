
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
	JSString *str;
	unparse up(cx);
	if (!up.unParse_start(obj, &str))
		return JS_FALSE;

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

	//uint32_t lineno = 1;
	//ScopedJSFreePtr<char> filename;
	////const char *quaziSnippet =  "function foo(){ y=.<3;>.; x= .< 2; >.; ast = .< .~y + .~x >.; ast = {type:'Program', body:[{ type:'ExpressionStatement', expression:{type:'BinaryExpression', operator:'+', left:y.body[0].expression, right:x.body[0].expression}}]}; return ast; } x = .! foo();";
	////const char *quaziSnippet =  "function foo(){ return .< 1; >.; } x = .! foo();";
	//const char *quaziSnippet = 
	//	"function power(x,n){	if(n==1) {return x;}else {return {type:'Program', body:[{ type:'ExpressionStatement', expression:{type:'BinaryExpression', operator:'*', left:x.body[0].expression, right: (power(x, n-1)).body[0].expression }}]};} } a = .! power(.<x;>., 4); ";
	//uint32_t quaziSnippetLength = strlen(quaziSnippet);
	//jschar *jsQuaziSnippet = InflateUTF8String(cx, quaziSnippet, &quaziSnippetLength);
	//jsval	rval;
	//
	//if (!reflect_parse_from_string(cx, jsQuaziSnippet, quaziSnippetLength, &rval))
	//	return JS_FALSE;

	//JS::Value args[] = { rval  };
	//JS::Value stringlify;
	//if (!JS_CallFunctionName(cx, global, "unparse", 1, args, &stringlify))
	//   return false;

//============================= JAST END ================================

//============================= JAST TEST START =========================
	uint32_t lineno = 1;
	ScopedJSFreePtr<char> filename;

	const char* tests[] = { "x;\n",
							"null;\n",
							"true;\n",
							"false;\n",
							"-0;\n",
							"x = y;\n",
							"void 0;\n",
							"void y;\n",
							"void f();\n",
							"[];\n",
							"({});\n",
							"({1e999: 0});\n",

							"({get \"a b\"() {\n \
							     return this;\n' \
							 }});\n",

							"({get 1() {\n \
							     return this;\n \
							 }});\n",

							"[,, 2];\n",
							"[, 1,,];\n",
							"[1,,, 2,,,];\n",
							"[,,,];\n",
							"[0, 1, 2, \"x\"];\n",

							"x.y.z;\n",
							"x[y[z]];\n",
							"x[\"y z\"];\n",

							"(0).toString();\n",
							"f()();\n",
							"f((x, y));\n",
							"f(x = 3);\n",
							"x.y();\n",
							"f(1, 2, 3, null, (g(), h));\n",
							"new (x.y);\n",
							"new (x());\n",
							"(new x).y;\n",
							"new (x().y);\n",
							"a * x + b * y;\n",
							"a * (x + b) * y;\n",
							"a + (b + c);\n",
							"a + b + c;\n",
	
							"x.y = z;\n",
							"get(id).text = f();\n",
							"[,] = x;\n",
	
	
							// Reconstituting constant-folded NaNs and Infinities
							"x = 1e999 + y;\n",
							"x = y / -1e999;\n",
							"x = 0 / 0;\n",
							"x = (-1e999).toString();\n",
	
							"if (a == b)\n \
							     x();\n \
							 else\n \
							     y();\n",

							"if (a == b) {\n \
							     x();\n \
							 } else {\n \
							     y();\n \
							 }\n",

							"if (a == b)\n \
							     if (b == c)\n \
							         x();\n \
							     else\n \
							         y();\n",

							"while (a == b)\n \
							     c();\n",

							"if (a)\n \
							     while (b)\n \
							         ;\n \
							 else\n \
							    c();\n",

							"if (a)\n \
							     while (b) {\n \
							         ;\n \
							     }\n \
							 else\n \
							     c();\n",

							"for (;;)\n \
							     ;\n",

							"for (let i = 0; i < a.length; i++) {\n \
							     b[i] = a[i];\n \
							 }\n",

							"for (t = (i in x); t; t = t[i])\n ;\n",

							"for (let t = (i in x); t; t = t[i])\n \
							    ;\n",

							"for (t = 1 << (i in x); t < 100; t++)\n \
							     ;\n",

							"for (var i in arr)\n \
							     dump(arr[i]);\n",

							"for ([k, v] in items(x))\n \
							     dump(k + \": \" + v);\n",

							"if (x) {\n \
							     switch (f(a)) {\n \
							     case f(b):\n \
							     case \"12\":\n \
							         throw exc;\n \
							     default:\n \
							         fall_through();\n \
							     case 99:\n \
							         succeed();\n \
							     }\n \
							 }\n",
	
							"var x;\n",
							"var x, y;\n",
							"var x = 1, y = x;\n",
							"var x = y = 1;\n",
							"var x = f, g;\n",
							"var x = (f, g);\n",
							"var [x] = a;\n",
							"var [] = x;\n",
							"var [, x] = y;\n",
							"var [[a, b], [c, d]] = x;\n",
							"var {} = x;\n",
							"var {x: x} = x;\n",
							"var {x: a, y: b} = x;\n",
							"var {1: a, 2: b} = x;\n",
							"var {1: [], 2: b} = x;\n",
							"var {\"a b\": x} = y;\n",
							"const a = 3;\n",
	};

	int testsLen = sizeof(tests)/sizeof(tests[0]);

	for(int i=0; i<testsLen; ++i){
		uint32_t testLen = strlen(tests[i]);
		jschar *testChars = InflateUTF8String(cx, tests[i], &testLen);
		jsval	rval;
		
		printf(" =========== initial string =====================\n");
		printf("%s\n",tests[i]);
		printf("\n=========== generated string =====================");

		if (!reflect_parse_from_string(cx, testChars, testLen, &rval))
			return JS_FALSE;

		JS::Value args[] = { rval  };
		JS::Value stringlify;
		if (!JS_CallFunctionName(cx, global, "unparse", 1, args, &stringlify))
		   return false;

		printf(" ==================================================\n\n");
	}

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
	//uint32_t lineno = 1;
	//ScopedJSFreePtr<char> filename;
	//const char *quaziSnippet =  "{t:3,q:'s', fun:function(){print(1);}, obj:{o:[]}}";

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