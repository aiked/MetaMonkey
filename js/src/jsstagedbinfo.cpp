/*
metadev
*/

#include "jsstagedbinfo.h"
#include "frontend/Parser.h"
#include "jsprf.h"
#include "jsstr.h"

using namespace js;

StagedDBInfo::StagedDBInfo(JSContext *_cx, JSObject *_dbInfo) : cx(_cx), dbInfo(_dbInfo) {};

StagedDBInfo * StagedDBInfo::createFromFile(JSContext *cx, const char *filename)
{
	jschar *chars;
	if (!JS::AutoFile::OpenAndReadAll(cx, filename, &chars))
		return NULL;
	return createFromString(cx, chars);
}

StagedDBInfo * StagedDBInfo::createFromString(JSContext *cx, const jschar *src)
{
	Value jsonVal;
	MutableHandle<Value> jsonValMut = MutableHandle<Value>::fromMarkedLocation(&jsonVal);
	if (!JS_ParseJSON(cx, src, js_strlen(src), jsonValMut))
		return NULL;
	return cx->new_<StagedDBInfo>(cx, jsonValMut.toObjectOrNull());
}

JSBool StagedDBInfo::getDebugAtDepth(uint32_t depth, JSObject **debug)
{
	char *filename = JS_sprintf_append(NULL, "%d", (int)depth);
	if (!JS_GetPropertyToObj(cx, dbInfo, filename, debug)){
		js_free(filename);
		return JS_FALSE; 
	}
	js_free(filename);
	return JS_TRUE;
}

JSBool StagedDBInfo::hasDebugAtDepth(uint32_t depth, bool *hasDebug)
{
	JSObject *debugObj;
	if(!getDebugAtDepth(depth, &debugObj))
		return JS_FALSE; 
	*hasDebug = !!debugObj;
	return JS_TRUE;
}

JSTrapStatus metaJsTrapHandler(JSContext *cx, JSScript *script, jsbytecode *pc, jsval *rvalArg, jsval closure)
{
	JSObject *depthLineInfo = JSVAL_TO_OBJECT(closure);
	int depthLineNo;
	if(!JS_GetPropertyToInt(cx, depthLineInfo, "lineNo", &depthLineNo))
		return JSTRAP_ERROR;

	JSObject *depthLineCommands;
	if(!JS_GetPropertyToObj(cx, depthLineInfo, "commands", &depthLineCommands))
		return JSTRAP_ERROR;

	if ( !JS_IsArrayObject(cx, depthLineCommands) ){
		JS_ReportError(cx, "wrong depthLineCommands, array is misssing");
		return JSTRAP_ERROR;
	}

	uint32_t depthLineCommandsLen;
	if ( !JS_GetArrayLength(cx, depthLineCommands, &depthLineCommandsLen) )
		return JSTRAP_ERROR;

	JSString *STR_PRINTLP = JS_NewStringCopyZ(cx, "print(");
	JSString *STR_DUMPOBJTLP = JS_NewStringCopyZ(cx, "dumpObject(");
	JSString *STR_DUMPHEAPLP = JS_NewStringCopyZ(cx, "dumpHeap(");
	JSString *STR_GETPDALP = JS_NewStringCopyZ(cx, "getpda(");
	JSString *STR_ARRAYINFOLP = JS_NewStringCopyZ(cx, "arrayInfo(");
	JSString *STR_RPCOL = JS_NewStringCopyZ(cx, ");");
	

	Vector<JSString*> commandsStr(cx);
	for(uint32_t i=0; i<depthLineCommandsLen; ++i){
		JSObject *depthLineCommand;
		if(!JS_GetArrayElementToObj(cx, depthLineCommands, i, &depthLineCommand))
			return JSTRAP_ERROR;

		JSString *type;
		if(!JS_GetPropertyToString(cx, depthLineCommand, "type", &type))
			return JSTRAP_ERROR;

		JSString *args;
		if(!JS_GetPropertyToString(cx, depthLineCommand, "args", &args))
			return JSTRAP_ERROR;

		JSString *command;
		if(type->equals("dump")){
			command = JS_JoinStrings(cx, 3, STR_PRINTLP, args, STR_RPCOL);
		} else if(type->equals("object info")){
			command = JS_JoinStrings(cx, 3, STR_DUMPOBJTLP, args, STR_RPCOL);
		} else if(type->equals("heap info")){
			command = JS_JoinStrings(cx, 2, STR_DUMPHEAPLP, STR_RPCOL);
		} else if(type->equals("object descriptor")){
			command = JS_JoinStrings(cx, 3, STR_GETPDALP, args, STR_RPCOL);
		} else if(type->equals("array info")){
			command = JS_JoinStrings(cx, 3, STR_ARRAYINFOLP, args, STR_RPCOL);
		} else {
			const char * chars = (const char *) type->getChars(cx);
			JS_ReportError(cx, "unsupposed debug command: %s", chars);
			return JSTRAP_ERROR;
		}
		commandsStr.append(command);
	}

	ScriptFrameIter iter(cx);
	JS_ASSERT(!iter.done());

    /* Debug-mode currently disables Ion compilation. */
    JSAbstractFramePtr frame(Jsvalify(iter.abstractFramePtr()));
    RootedScript dbscript(cx, iter.script());

    size_t length;
    const jschar *chars = JS_GetStringCharsAndLength(cx, 
					JS_JoinStringVector(cx, &commandsStr, NULL, NULL, NULL), &length);
    if (!chars)
        return JSTRAP_ERROR;

	RootedValue rval(cx, *rvalArg);
	JS_ReportInfo(cx, "\texecuting debugger commands for line: %d\n", depthLineNo);
    if (!frame.evaluateUCInStackFrame(cx, chars, length,
                                      dbscript->filename(),
                                      dbscript->lineno,
                                      &rval))
    {
        *rvalArg = rval;
        return JSTRAP_ERROR;
    }
    *rvalArg = rval;
    if (!rval.isUndefined())
        return JSTRAP_RETURN;
    return JSTRAP_CONTINUE;
}

JSBool StagedDBInfo::debug(const char *source, uint32_t depth)
{
	JSObject *depthDebug;
	if(!(getDebugAtDepth(depth, &depthDebug) && depthDebug)){
		JS_ReportError(cx, "wrong debug file format, depth object is missing");
		return JS_FALSE; 
	}

	JSScript *script = JS_CompileScript(cx, cx->global(), source, strlen(source), "inlineEval.js", 1);
	if(!script)
		return JS_FALSE;

	if ( !JS_IsArrayObject(cx, depthDebug) ){
		JS_ReportError(cx, "wrong debug file format, depth array is misssing");
		return JS_FALSE;
	}

	uint32_t depthDebugLen;
	if ( !JS_GetArrayLength(cx, depthDebug, &depthDebugLen) )
		return JS_FALSE;

	if(!JS_SetDebugMode(cx, JS_TRUE))
		return JS_FALSE;

	//if(!JS_SetDebugMode(cx, JS_FALSE))
	//	return JS_FALSE;	

	for( uint32_t i=0; i<depthDebugLen; ++i ){
		JSObject *depthLineInfo;
		if(!JS_GetArrayElementToObj(cx, depthDebug, i, &depthLineInfo))
			return JS_FALSE;

		int depthLineNo;
		if(!JS_GetPropertyToInt(cx, depthLineInfo, "lineNo", &depthLineNo))
			return JS_FALSE;

		JSObject *depthLineCommands;
		if(!JS_GetPropertyToObj(cx, depthLineInfo, "commands", &depthLineCommands))
			return JS_FALSE;

		jsbytecode *bytecodePc = JS_LineNumberToPC(cx, script, (unsigned int)depthLineNo);
		if(!JS_SetTrap(cx, script, bytecodePc, metaJsTrapHandler, OBJECT_TO_JSVAL(depthLineInfo)))
			   return JS_FALSE;
	}
	JS_ReportInfo(cx, "\tdb start\n");
	jsval inlineRetVal;
	if (!JS_ExecuteScript(cx, cx->global(), script, &inlineRetVal))
		return JS_FALSE;
	JS_ReportInfo(cx, "\tdb finished\n");



	return JS_TRUE;
}
