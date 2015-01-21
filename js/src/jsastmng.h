/*
metadev
*/

#pragma once

#ifndef jsastmng_h
#define jsastmng_h

#include "jsapi.h"
#include "frontend/Parser.h"

namespace js {

typedef Vector<Shape *, 8, SystemAllocPolicy> ObjectKeysVector;

class AstObjMng{

  public:
	static JSBool getUnaryExpr(JSContext *cx, JSObject *node, JSString **op, JSObject **body);
	static JSBool getUnaryExprStmt(JSContext *cx, JSObject *node, JSString **op, JSObject **body);
	static JSBool getUnary(JSContext *cx, JSObject *node, JSString **op, JSObject **body);
	static JSBool getSpecificUnaryExpr(JSContext *cx, JSObject *node, const char *op, JSObject **body);

	static JSBool getMetaExecStmt(JSContext *cx, JSObject *node, JSObject **body);
	static JSBool getMetaExecExprStmt(JSContext *cx, JSObject *node, JSObject **body);
	static JSBool getMetaExec(JSContext *cx, JSObject *node, JSObject **body);

	static JSBool getMetaQuaziStmt(JSContext *cx, JSObject *node, JSObject **body);

	static JSBool getExprStmt(JSContext *cx, JSObject *node, JSObject **expr);

	static JSBool WrapStmt(JSContext *cx, jsval *stmtVal);
	static JSBool GetBodyFromProgram(JSContext *cx, jsval astObjVal, JSObject **bodyObj, 
										uint32_t *bodyChildrenLen );
	static JSBool GetStmtsFromAstObj(JSContext *cx, bool fromStmt, jsval astObjVal,  
										JSObject **vp, uint32_t *bodyChildrenLen); 
};

class AstObjIterator{
	
	Vector<JSObject *> parentObjectIteratorStack;
	JSContext *cx;

  public:
	AstObjIterator(JSContext *cx);

  private:
	template<class IterateObjectApplier>
	JSBool iterateObjectValue(const char *propKey, const Value &v, IterateObjectApplier *applier)
	{
		if (v.isObject()) {
			JSObject *obj = &v.toObject();
			JSObject *parentObj = getLastParentIterateObject();
			if( JS_IsArrayObject(cx, obj) ){
				uint32_t arrayLen;
				if (!JS_GetArrayLength(cx, obj, &arrayLen))
					return JS_FALSE;
			
				if(!applier->arrayLoopStart(obj, parentObj, arrayLen))
					return JS_FALSE;
				for(uint32_t i=0; i<arrayLen; ++i) {
					JSObject *nodeObj = NULL;
					if( !JS_GetArrayElementToObj(cx, obj, i, &nodeObj) )
						return JS_FALSE;
					
					if( !applier->arrayLoopIdxEnter(obj, parentObj, i, nodeObj))
						return JS_FALSE;

					if( !iterateObject( nodeObj, applier ) )
						return JS_FALSE;

					if( !applier->arrayLoopIdxExit(obj, parentObj, i, nodeObj))
						return JS_FALSE;
				}
				if( !applier->arrayLoopEnd(obj, parentObj))
					return JS_FALSE;

			} else { // Case: Single object
				if( !applier->singleObjEnter(propKey, obj, parentObj) )
					return JS_FALSE;

				if( !iterateObject( obj, applier) )
					return JS_FALSE;
			
				if( !applier->singleObjExit(propKey, obj, parentObj) )
					return JS_FALSE;
			}	
		} 
		return JS_TRUE;
	}

  public:
	template<class IterateObjectApplier>
	JSBool iterateObject(JSObject *obj, IterateObjectApplier *applier)
	{
		if( !obj->isNative() ) {
			JS_ReportError(cx, "object is not native stringifyObject");
			return JS_FALSE;
		}

		parentObjectIteratorStack.append(obj);
		ObjectKeysVector props;
		for (Shape::Range<NoGC> r(obj->lastProperty()); !r.empty(); r.popFront()){
			Shape &prop = r.front();
			jsid id = prop.propid();
			if (!JSID_IS_ATOM(id)){
				JS_ReportError(cx, "no jsid stringifyObjectProperty");
				return JS_FALSE;
			}
			uint32_t slot = prop.hasSlot() ? prop.maybeSlot() : SHAPE_INVALID_SLOT;
			if (!prop.hasSlot()) {
				JS_ReportError(cx, "property has not shape slot stringifyObjectProperty");
				return JS_FALSE;
			}
			const char *propKey = JS_EncodeString(cx, JSID_TO_STRING(id));
			if (!iterateObjectValue(propKey, obj->getSlot(slot), applier))
				return JS_FALSE;
		}
		JSObject *lastParentObj = parentObjectIteratorStack.popCopy();

		return JS_TRUE;
	}

	JSObject* getLastParentIterateObject();
};

}/* js */

#endif /* jsastmng_h */