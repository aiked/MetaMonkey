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

	static JSBool getInlineNode(JSContext *cx, JSObject *parentNode, JSObject *node, 
								JSObject **expr, bool *isExpr, const uint32_t depth);
	static JSBool getExecNode(JSContext *cx, JSObject *parentNode, JSObject *node, 
								JSObject **stmt, bool *isExpr, const uint32_t depth);
	
};

class AstObjIterator{
	
	Vector<JSObject *> parentObjectIteratorStack;
	JSContext *cx;

  public:
	AstObjIterator(JSContext *cx);

  private:
	template<class IterateObjectApplier>
	JSBool iterateObjectValue(const Value &v, IterateObjectApplier *applier)
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

					if( !applier->arrayLoopIdx(obj, parentObj, i, nodeObj))
						return JS_FALSE;

					if( !iterateObject( nodeObj, applier ) )
						return JS_FALSE;
				}
				if( !applier->arrayLoopEnd(obj, parentObj))
					return JS_FALSE;

			} else { // Case: Single object
				if( !applier->singleObj(obj, parentObj) )
					return JS_FALSE;

				if( !iterateObject( obj, applier) )
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

		ObjectKeysVector props;
		for (Shape::Range<NoGC> r(obj->lastProperty()); !r.empty(); r.popFront()){
			props.append(&r.front());
		}
		parentObjectIteratorStack.append(obj);
		for (size_t i = props.length(); i-- != 0;){
			Shape &shape = *props[i];
			if (!JSID_IS_ATOM(shape.propid())){
				JS_ReportError(cx, "no jsid stringifyObjectProperty");
				return JS_FALSE;
			}

			uint32_t slot = shape.hasSlot() ? shape.maybeSlot() : SHAPE_INVALID_SLOT;
			if (!shape.hasSlot()) {
				JS_ReportError(cx, "property has not shape slot stringifyObjectProperty");
				return JS_FALSE;
			}

			if (!iterateObjectValue(obj->getSlot(slot), applier))
				return JS_FALSE;
		}
		JSObject *lastParentObj = parentObjectIteratorStack.popCopy();

		return JS_TRUE;
	}

	JSObject* getLastParentIterateObject();

};

}/* js */

#endif /* jsastmng_h */