#include "jsastmng.h"

using namespace js;

JSBool AstObjMng::getUnaryExpr(JSContext *cx, JSObject *node, JSString **op, JSObject **body)
{
	JSString *typeStr;
	if( !JS_GetPropertyToString(cx, node, "type", &typeStr) )
		return JS_FALSE;

	if( typeStr && typeStr->equals("UnaryExpression")) {
		if( !JS_GetPropertyToString(cx, node, "operator", op) )
			return JS_FALSE;

		if( !JS_GetPropertyToObj(cx, node, "argument", body) )
			return JS_FALSE;
	}else {
		*body = NULL;
	}
	return JS_TRUE;
}

JSBool AstObjMng::getUnaryExprStmt(JSContext *cx, JSObject *node, JSString **op, JSObject **body)
{
	JSString *typeStr;
	if( !JS_GetPropertyToString(cx, node, "type", &typeStr) )
		return JS_FALSE;
	if(typeStr->equals("ExpressionStatement")) {

		if( !JS_GetPropertyToObj(cx, node, "expression", body) )
			return JS_FALSE;

		if( !getUnaryExpr(cx, *body, op, body) )
			return JS_FALSE;
	}else {
		*body = NULL;
	}
	return JS_TRUE;
}

JSBool AstObjMng::getUnary(JSContext *cx, JSObject *node, JSString **op, JSObject **body)
{
	if( !getUnaryExprStmt(cx, node, op, body) )
		return JS_FALSE;

	if( !*(body) && !getUnaryExpr(cx, node, op, body) )
		return JS_FALSE;

	return JS_TRUE;
}

JSBool AstObjMng::getSpecificUnaryExpr(JSContext *cx, JSObject *node, const char *op, JSObject **body)
{
	JSString *opType;
	if( !getUnaryExpr(cx, node, &opType, body) )
		return JS_FALSE;

	if(!opType->equals(op)) {
		body = NULL;
	}
	return JS_TRUE;
}

JSBool AstObjMng::getMetaExecStmt(JSContext *cx, JSObject *node, JSObject **body)
{
	JSString *typeStr;
	if( !JS_GetPropertyToString(cx, node, "type", &typeStr) )
		return JS_FALSE;

	*body = NULL;
	if(typeStr->equals("MetaExecStatement")) {
		if( !JS_GetPropertyToObj(cx, node, "body", body) )
			return JS_FALSE;
	}
	return JS_TRUE;
}

JSBool AstObjMng::getMetaExecExprStmt(JSContext *cx, JSObject *node, JSObject **body)
{
	JSString *typeStr;
	*body = NULL;
	if( !JS_GetPropertyToString(cx, node, "type", &typeStr) )
		return JS_FALSE;
	if(typeStr->equals("ExpressionStatement")) {
		if( !JS_GetPropertyToObj(cx, node, "expression", body) )
			return JS_FALSE;

		if( !getMetaExecStmt(cx, *body, body) )
			return JS_FALSE;
	}
	return JS_TRUE;
}

JSBool AstObjMng::getMetaExec(JSContext *cx, JSObject *node, JSObject **body)
{
	if( !AstObjMng::getMetaExecExprStmt(cx, node, body) )
		return JS_FALSE;

	if( !*(body) && !AstObjMng::getMetaExecStmt(cx, node, body) )
		return JS_FALSE;

	return JS_TRUE;
}

JSBool AstObjMng::getExecNode(JSContext *cx, JSObject *parentNode, JSObject *node, 
								JSObject **stmt, bool *isExpr, const uint32_t depth)
{
	JSObject *parentBody;
	if( parentNode ) {
		if(!AstObjMng::getMetaExecStmt(cx, parentNode, &parentBody))
			return JS_FALSE;

		if(parentBody){
			*stmt = NULL;
			return JS_TRUE;
		}
	}
	uint32_t currDepth = 0;
	JSObject *lastExecNode = NULL;
	*stmt = NULL;
	bool firstLoop = true;
	while(1) {
		JSObject *tmpNode;
		if( !AstObjMng::getMetaExecExprStmt(cx, node, &tmpNode) )
			return JS_FALSE;

		if(firstLoop) 
			*isExpr = !!tmpNode;

		if( !tmpNode && !AstObjMng::getMetaExecStmt(cx, node, &tmpNode) )
			return JS_FALSE;

		if(tmpNode) {
			++currDepth;
			lastExecNode = tmpNode;
			node = tmpNode;
		}else {
			if(depth==currDepth-1){
				*stmt = lastExecNode;
			}
			break;
		}
		firstLoop = false;
	}
	return JS_TRUE;
}

JSBool AstObjMng::getInlineNode(JSContext *cx, JSObject *parentNode, JSObject *node, 
								JSObject **expr, bool *isExpr, const uint32_t depth)
{
	JSObject *parentBody;
	if( parentNode ) {
		if(!AstObjMng::getMetaExecStmt(cx, parentNode, &parentBody))
			return JS_FALSE;

		if(parentBody){
			*expr = NULL;
			return JS_TRUE;
		}
	}
	uint32_t currDepth = 0;
	*expr = NULL;
	bool firstLoop = true;
	while(1) {
		JSObject *tmpNode;
		if( !AstObjMng::getMetaExecExprStmt(cx, node, &tmpNode) )
			return JS_FALSE;

		if(firstLoop) 
			*isExpr = !!tmpNode;

		if( !tmpNode && !AstObjMng::getMetaExecStmt(cx, node, &tmpNode) )
			return JS_FALSE;

		if(tmpNode) {
			++currDepth;
			node = tmpNode;
		}else {
			JSObject *inlineBody;
			JSString *op;
			if( !AstObjMng::getUnaryExpr(cx, node, &op, &inlineBody) )
				return JS_FALSE;

			if(firstLoop) 
				*isExpr = !!inlineBody;

			if( !inlineBody && !AstObjMng::getUnaryExprStmt(cx, node, &op, &inlineBody) )
				return JS_FALSE;
			
			if( inlineBody && op->equals(".!") && currDepth==depth ) {
				*expr = inlineBody;
			}
			break;
		}
		firstLoop = false;
	}
	return JS_TRUE;
}



///////////////////////////////////////////////////
// iterate object

AstObjIterator::AstObjIterator(JSContext *x): cx(x), parentObjectIteratorStack(x){}

JSObject* AstObjIterator::getLastParentIterateObject()
{
	if(parentObjectIteratorStack.empty())
		return NULL;
	
	return parentObjectIteratorStack.back();
}



////////////////////////// iterate object