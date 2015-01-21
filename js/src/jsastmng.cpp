#include "jsastmng.h"

using namespace js;

JSBool AstObjMng::getUnaryExpr(JSContext *cx, JSObject *node, JSString **op, JSObject **body)
{
	*body = NULL;
	JSString *typeStr;
	if( !JS_GetPropertyToString(cx, node, "type", &typeStr) )
		return JS_FALSE;

	if( typeStr && typeStr->equals("UnaryExpression")) {
		if( !JS_GetPropertyToString(cx, node, "operator", op) )
			return JS_FALSE;

		if( !JS_GetPropertyToObj(cx, node, "argument", body) )
			return JS_FALSE;
	}
	return JS_TRUE;
}

JSBool AstObjMng::getUnaryExprStmt(JSContext *cx, JSObject *node, JSString **op, JSObject **body)
{
	*body = NULL;
	JSObject *expr;
	if( !getExprStmt(cx, node, &expr) )
		return JS_FALSE;

	if(expr) {
		if( !getUnaryExpr(cx, expr, op, body) )
			return JS_FALSE;
	}
	return JS_TRUE;
}

JSBool AstObjMng::getUnary(JSContext *cx, JSObject *node, JSString **op, JSObject **body)
{
	*body = NULL;
	if( !getUnaryExprStmt(cx, node, op, body) )
		return JS_FALSE;

	if( !*(body) && !getUnaryExpr(cx, node, op, body) )
		return JS_FALSE;

	return JS_TRUE;
}

JSBool AstObjMng::getSpecificUnaryExpr(JSContext *cx, JSObject *node, const char *op, JSObject **body)
{
	*body = NULL;
	JSString *opType;
	if( !getUnaryExpr(cx, node, &opType, body) )
		return JS_FALSE;

	if( !(*body && opType->equals(op)) ) {
		*body = NULL;
	}
	return JS_TRUE;
}

JSBool AstObjMng::getMetaExecStmt(JSContext *cx, JSObject *node, JSObject **body)
{
	*body = NULL;
	JSString *typeStr;
	if( !JS_GetPropertyToString(cx, node, "type", &typeStr) )
		return JS_FALSE;

	if(typeStr->equals("MetaExecStatement")) {
		if( !JS_GetPropertyToObj(cx, node, "body", body) )
			return JS_FALSE;
	}
	return JS_TRUE;
}

JSBool AstObjMng::getMetaExecExprStmt(JSContext *cx, JSObject *node, JSObject **body)
{
	*body = NULL;
	JSObject *expr;
	if( !getExprStmt(cx, node, &expr) )
		return JS_FALSE;

	if(expr) {
		if( !getMetaExecStmt(cx, expr, body) )
			return JS_FALSE;
	}
	return JS_TRUE;
}

JSBool AstObjMng::getMetaExec(JSContext *cx, JSObject *node, JSObject **body)
{
	*body = NULL;
	if( !AstObjMng::getMetaExecExprStmt(cx, node, body) )
		return JS_FALSE;

	if( !*(body) && !AstObjMng::getMetaExecStmt(cx, node, body) )
		return JS_FALSE;

	return JS_TRUE;
}

JSBool AstObjMng::getMetaQuaziStmt(JSContext *cx, JSObject *node, JSObject **body)
{
	*body = NULL;
	JSString *typeStr;
	if( !JS_GetPropertyToString(cx, node, "type", &typeStr) )
		return JS_FALSE;

	if(typeStr->equals("MetaQuaziStatement")) {
		if( !JS_GetPropertyToObj(cx, node, "body", body) )
			return JS_FALSE;
	}
	return JS_TRUE;
}

JSBool AstObjMng::getExprStmt(JSContext *cx, JSObject *node, JSObject **expr)
{
	*expr = NULL;
	JSString *typeStr;
	if( !JS_GetPropertyToString(cx, node, "type", &typeStr) )
		return JS_FALSE;

	if(typeStr->equals("ExpressionStatement")) {
		if( !JS_GetPropertyToObj(cx, node, "expression", expr) )
			return JS_FALSE;
	}
	return JS_TRUE;
}


JSBool AstObjMng::WrapStmt(JSContext *cx, jsval *stmtVal)
{
	JSObject *stmtObj;
	if( !JS_ValueToObject(cx, *stmtVal, &stmtObj) )
		return JS_FALSE;

	JSObject *exprObj;
	if( !JS_GetPropertyToObj(cx, stmtObj, "expression", &exprObj) )
		return JS_FALSE;

	*stmtVal = OBJECT_TO_JSVAL(exprObj);
	return JS_TRUE;
}


JSBool AstObjMng::GetBodyFromProgram(JSContext *cx, jsval astObjVal, 
							JSObject **bodyObj, uint32_t *bodyChildrenLen )
{
	JSObject *astObj = JSVAL_TO_OBJECT(astObjVal);
	if( !astObj )
		return JS_FALSE;

	JSString *astTypeStr;
	if( !JS_GetPropertyToString(cx, astObj, "type", &astTypeStr) )
		return JS_FALSE;

	if ( !astTypeStr->equals("Program") ) {
		JS_ReportError(cx, "object type is not program");
		return JS_FALSE;
	}

	if( !JS_GetPropertyToObj(cx, astObj, "body", bodyObj) )
		return JS_FALSE;

	if ( !JS_IsArrayObject(cx, *bodyObj) ){
		JS_ReportError(cx, "Program.body is not an array.");
		return JS_FALSE;
	}

	if ( !JS_GetArrayLength(cx, *bodyObj, bodyChildrenLen) )
		return JS_FALSE;
	
	return JS_TRUE;
}


JSBool AstObjMng::GetStmtsFromAstObj(JSContext *cx, bool fromStmt, jsval astObjVal,  
										JSObject **vp, uint32_t *bodyChildrenLen) 
{
	JSObject *bodyObj;
	if( !GetBodyFromProgram(cx, astObjVal, &bodyObj, bodyChildrenLen) )
		return JS_FALSE;

	for( uint32_t i=0; i<*bodyChildrenLen; ++i ){
		jsval stmtVal;
		if (!JS_GetElement(cx, bodyObj, i, &stmtVal))
			return JS_FALSE;
		if ( !fromStmt && !WrapStmt(cx, &stmtVal) )
			return JS_FALSE;
		if ( !JS_ArrayObjPush(cx, *vp, &stmtVal ) )
			return JS_FALSE;
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