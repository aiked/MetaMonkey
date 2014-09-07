/*
metadev
*/

#include "jsunparse.h"
#include <cstdarg>
#include <iostream>
#include <regex>

using namespace js;


/////////////////////////// 
// expression

JSBool unparse::expr_array(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	JSObject *arrayObj;
	if( !getObjPropertyAndConvertToObj(val, "elements", &arrayObj) )
		return JS_FALSE;

	uint32_t arrayLen;
	if (!JS_GetArrayLength(cx, arrayObj, &arrayLen))
		return JS_FALSE;

	Vector<JSString*> children(cx);
	children.append(srcStr(JSSRCNAME_LB));

	for(uint32_t i=0; i<arrayLen; ++i) {
		
		JSObject *nodeObj = NULL;
		if( !getArrayElementAndConvertToObj(arrayObj, i, &nodeObj) )
			return JS_FALSE;

		if (nodeObj){
			if(i!=0)
				children.append(srcStr(JSSRCNAME_SPACE));
		
			JSString *nodeStr;
			if( !unparse_expr(nodeObj, &nodeStr, indent, 2, false) )
				return JS_FALSE;
			children.append(nodeStr);
		}

		if( i != arrayLen-1 || !nodeObj ){
			children.append(srcStr(JSSRCNAME_COMMA));
		}
	}

	children.append(srcStr(JSSRCNAME_RB));
	
	*child = joinStringVector(&children, NULL, NULL, NULL);

	return JS_TRUE;
}

JSBool unparse::expr_obj(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	JSObject *propertiesObj;
	if( !getObjPropertyAndConvertToObj(val, "properties", &propertiesObj) )
		return JS_FALSE;

	uint32_t propertiesLen;
	if (!JS_GetArrayLength(cx, propertiesObj, &propertiesLen))
		return JS_FALSE;

	Vector<JSString*> children(cx);
	children.append(srcStr(JSSRCNAME_LC));

	for (uint32_t i=0; i<propertiesLen; ++i){

		JSObject *propObj;
		if( !getArrayElementAndConvertToObj(propertiesObj, i, &propObj) )
			return JS_FALSE;

		JSString *kindStr;
		if( !getObjPropertyAndConvertToString(propObj, "kind", &kindStr) )
			return JS_FALSE;

		if ( kindStr->equals("init") ){
			
			JSObject *keyObj, *valueObj;
			if( !getObjPropertyAndConvertToObj(propObj, "key", &keyObj) )
				return JS_FALSE;
			if( !getObjPropertyAndConvertToObj(propObj, "value", &valueObj) )
				return JS_FALSE;

			JSString *initKeyStr, *initValueStr;
			if( !unparse_expr(keyObj, &initKeyStr, indent, 18, false) )
				return JS_FALSE;
			if( !unparse_expr(valueObj, &initValueStr, indent, 2, false) )
				return JS_FALSE;

			children.append(initKeyStr);
			children.append(srcStr(JSSRCNAME_COLONSPACE));
			children.append(initValueStr);

			if( i != propertiesLen-1 )
				children.append(srcStr(JSSRCNAME_COMMA));
		}
		else if ( kindStr->equals("get") || kindStr->equals("set") ){
			jsval keyVal;
			if (!JS_GetProperty(cx, propObj, "key", &keyVal))
				return JS_FALSE;

			JSObject *valueObj;
			if( !getObjPropertyAndConvertToObj(propObj, "value", &valueObj) )
				return JS_FALSE;

			JSString *functionStr;
			if( !functionDeclaration(kindStr, &functionStr, keyVal, valueObj, indent ) )
				return JS_FALSE;

			children.append(functionStr);

			if( i != propertiesLen-1 )
				children.append(srcStr(JSSRCNAME_COMMA));
		}
		else{
			JSString *unexpectedStr;
			unexpected(val, &unexpectedStr);

			children.append(unexpectedStr);

			if( i != propertiesLen-1 )
				children.append(srcStr(JSSRCNAME_COMMA));
		}
	}

	children.append(srcStr(JSSRCNAME_RC));

	*child = joinStringVector(&children, NULL, NULL, NULL);

	return JS_TRUE;
}

JSBool unparse::expr_graph(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	JSString *indexStr;
	if( !getObjPropertyAndConvertToString(val, "index", &indexStr) )
		return JS_FALSE;

	JSObject *expressionObj;
	if( !getObjPropertyAndConvertToObj(val, "expression", &expressionObj) )
		return JS_FALSE;

	JSString *expressionStr;
	if( !unparse_expr(expressionObj, &expressionStr, indent, 18, false) )
		return JS_FALSE;

	*child = joinString(4, srcStr(JSSRCNAME_HASH), indexStr, 
						srcStr(JSSRCNAME_ASSIGN), expressionStr );

	return JS_TRUE;
}

JSBool unparse::expr_graphIndx(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	JSString *indexStr;
	if( !getObjPropertyAndConvertToString(val, "index", &indexStr) )
		return JS_FALSE;

	*child = joinString(3, srcStr(JSSRCNAME_HASH), indexStr, srcStr(JSSRCNAME_HASH) );

	return JS_TRUE;
}

JSBool unparse::expr_let(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	JSObject *headObj; 
	if( !getObjPropertyAndConvertToObj(val, "head", &headObj) )
		return JS_FALSE;

	JSObject *bodyObj;
	if( !getObjPropertyAndConvertToObj(val, "body", &bodyObj) )
		return JS_FALSE;

	JSString *headStr;
	if ( !declarators(headObj, &headStr, indent, false) )
		return JS_FALSE;

	JSString *expressionStr;
	if( !unparse_expr(bodyObj, &expressionStr, indent, 2, false) )
		return JS_FALSE;

	*child = joinString(5, srcStr(JSSRCNAME_VARSPACELP), headStr,
							srcStr(JSSRCNAME_RP), srcStr(JSSRCNAME_SPACE), expressionStr );
		
	if( !wrapExpr(child, cprec, 3) )
		return JS_FALSE;

	return JS_TRUE;
}

JSBool unparse::expr_gen(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn){
	
	JSString *compreStr;
	if ( !comprehension(val, &compreStr, indent) )
		return JS_FALSE;

	*child = joinString(3, srcStr(JSSRCNAME_LP), compreStr, srcStr(JSSRCNAME_RP));

	return JS_TRUE;
}

JSBool unparse::expr_comprehen(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	JSString *compreStr;
	if ( !comprehension(val, &compreStr, indent) )
		return JS_FALSE;

	*child = joinString(3, srcStr(JSSRCNAME_LB), compreStr, srcStr(JSSRCNAME_RB));

	return JS_TRUE;
}

JSBool unparse::expr_yield(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn){
	Vector<JSString*> children(cx);
	children.append(srcStr(JSSRCNAME_YIELD));

	jsval argumentVal;
	if (!JS_GetProperty(cx, val, "argument", &argumentVal))
		return JS_FALSE;

	if( argumentVal.isObject() ){
		JSObject *argumentObj;
		if( !JS_ValueToObject(cx, argumentVal, &argumentObj) )
			return JS_FALSE;

		JSString *argumentStr;
		if( !unparse_expr(argumentObj, &argumentStr, indent, 2, false) )
			return JS_FALSE;
		children.append(argumentStr);
	}
	*child = joinStringVector(&children, NULL, NULL, NULL);

	wrapExpr(child, cprec, 1);

	return JS_TRUE;
}

JSBool unparse::expr_sequence(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn){
	
	JSObject *expressionsObj;
	if( !getObjPropertyAndConvertToObj(val, "expressions", &expressionsObj) )
		return JS_FALSE;

	uint32_t expressionsLen;
	if (!JS_GetArrayLength(cx, expressionsObj, &expressionsLen))
		return JS_FALSE;

	Vector<JSString*> children(cx);

	for (uint32_t i=0; i<expressionsLen; ++i){

		JSObject *propObj;
		if( !getArrayElementAndConvertToObj(expressionsObj, i, &propObj) )
			return JS_FALSE;

		JSString *exprStr;
		if( !unparse_expr(propObj, &exprStr, indent, 2, noIn) )
			return JS_FALSE;

		children.append(exprStr);

		if( i != expressionsLen-1 ){
				children.append(srcStr(JSSRCNAME_COMMA));
		}
	}

	*child = joinStringVector(&children, NULL, NULL, NULL);

	if( !wrapExpr(child, cprec, 2) )
		return JS_FALSE;

	return JS_TRUE;
}

JSBool unparse::expr_cond(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn){

	JSObject *testObj;
	if( !getObjPropertyAndConvertToObj(val, "test", &testObj) )
		return JS_FALSE;

	JSString *testStr;
	if( !unparse_expr(testObj, &testStr, indent, 4, noIn) )
		return JS_FALSE;

	JSObject *consequentObj;
	if( !getObjPropertyAndConvertToObj(val, "consequent", &consequentObj) )
		return JS_FALSE;

	JSString *consequentStr;
	if( !unparse_expr(consequentObj, &consequentStr, indent, 0, noIn) )
		return JS_FALSE;

	JSObject *alternateObj;
	if( !getObjPropertyAndConvertToObj(val, "alternate", &alternateObj) )
		return JS_FALSE;

	JSString *alternateStr;
	if( !unparse_expr(alternateObj, &alternateStr, indent, 3, noIn) )
		return JS_FALSE;

	*child = joinString( 5, testStr, srcStr(JSSRCNAME_QUESTION),
						consequentStr, srcStr(JSSRCNAME_COLON), alternateStr );

	if( !wrapExpr(child, cprec, 4) )
		return JS_FALSE;
	
	return JS_TRUE;
}

JSBool unparse::expr_indent(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	if( !getObjPropertyAndConvertToString(val, "name", child) )
		return JS_FALSE;

	return JS_TRUE;
}

JSBool unparse::expr_literal(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	jsval objType;
	if (!JS_GetProperty(cx, val, "value", &objType)){
		JS_ReportError(cx, "object has not key: value");
		return JS_FALSE;
	}

	*child = JS_ValueToString(cx, objType);
	if (!child){
		JS_ReportError(cx, "expr_literal cannot convert value to string");
		return JS_FALSE;
	}

	JSType valType = JS_TypeOfValue(cx, objType);
	switch(valType){
		case JSTYPE_NUMBER:
			if(cprec==17)
				*child = joinString(3, srcStr(JSSRCNAME_LP), *child, srcStr(JSSRCNAME_RP));
			break;

		case JSTYPE_STRING:
			*child = joinString(3, srcStr(JSSRCNAME_QM), *child, srcStr(JSSRCNAME_QM));
			break;
	}

	return JS_TRUE;
}

JSBool unparse::expr_call(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	JSObject *calleeObj;
	if( !getObjPropertyAndConvertToObj(val, "callee", &calleeObj) )
		return JS_FALSE;

	JSString *exprStr;
	if( !unparse_expr(calleeObj, &exprStr, indent, 17, false) ){
		return JS_FALSE;
	}

	JSObject *argsObj;
	if( !getObjPropertyAndConvertToObj(val, "arguments", &argsObj) )
		return JS_FALSE;

	JSString *argsStr;	
	if( !args(argsObj, &argsStr, indent) ){
		return JS_FALSE;
	}

	*child = joinString(2, exprStr, argsStr);
	if( !wrapExpr(child, cprec, 18) )
		return JS_FALSE;

	return JS_TRUE;
}

JSBool unparse::expr_new(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn){

	JSObject *argsObj;
	if( !getObjPropertyAndConvertToObj(val, "arguments", &argsObj) )
		return JS_FALSE;

	uint32_t argsLen;
	if (!JS_GetArrayLength(cx, argsObj, &argsLen))
		return JS_FALSE;

	if ( argsLen == 0 ){
		JSObject *calleeObj;
		if( !getObjPropertyAndConvertToObj(val, "callee", &calleeObj) )
			return JS_FALSE;

		JSString *exprStr;
		if( !unparse_expr(calleeObj, &exprStr, indent, 18, false) )
			return JS_FALSE;

		*child = joinString(3, srcStr(JSSRCNAME_NEW), srcStr(JSSRCNAME_SPACE), exprStr); 
		
		if( !wrapExpr(child, cprec, 17) )
			return JS_FALSE;
	}
	else{
		JSObject *calleeObj;
		if( !getObjPropertyAndConvertToObj(val, "callee", &calleeObj) )
			return JS_FALSE;

		JSString *exprStr;
		if( !unparse_expr(calleeObj, &exprStr, indent, 18, false) )
			return JS_FALSE;

		JSString *argsStr;
		if ( !args(argsObj, &argsStr, indent) )
			return JS_FALSE;

		*child = joinString(4, srcStr(JSSRCNAME_NEW), srcStr(JSSRCNAME_SPACE), exprStr, argsStr); 
		
		if( !wrapExpr(child, cprec, 17) )
			return JS_FALSE;
	}

	return JS_TRUE;
}

JSBool unparse::expr_this(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn){
	*child = srcStr(JSSRCNAME_THIS);

	return JS_TRUE;
}

JSBool unparse::expr_member(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn){
	Vector<JSString*> children(cx);

	JSObject *objectObj;
	if( !getObjPropertyAndConvertToObj(val, "object", &objectObj) )
		return JS_FALSE;

	JSString *objectStr;
	if( !unparse_expr(objectObj, &objectStr, indent, 17, false) )
		return JS_FALSE;

	children.append(objectStr);

	JSObject *propertyObj;
	if( !getObjPropertyAndConvertToObj(val, "property", &propertyObj) )
		return JS_FALSE;

	jsval computedVal;
	if (!JS_GetProperty(cx, val, "computed", &computedVal))
		return JS_FALSE;

	if( ToBoolean(computedVal) ){
		JSString *propertyStr;
		if( !unparse_expr(propertyObj, &propertyStr, indent, 0, false) )
			return JS_FALSE;

		children.append(srcStr(JSSRCNAME_LB));
		children.append(propertyStr);
		children.append(srcStr(JSSRCNAME_RB));
	}
	else{
		JSBool isBad;
		if ( !isBadIdentifier(propertyObj, &isBad) )
			return JS_FALSE;

		if( isBad ){
			JSString *nameStr;
			if( !expr_indent( propertyObj, &nameStr, indent, cprec, noIn ))
				return JS_FALSE;

			children.append(srcStr(JSSRCNAME_LB));
			children.append(srcStr(JSSRCNAME_QM));
			children.append(nameStr);
			children.append(srcStr(JSSRCNAME_QM));
			children.append(srcStr(JSSRCNAME_RB));
		}
		else{
			JSString *propertyStr;
			if( !unparse_expr(propertyObj, &propertyStr, indent, 18, false) )
				return JS_FALSE;

			children.append(srcStr(JSSRCNAME_DOT));
			children.append(propertyStr);
		}
	}

	*child = joinStringVector(&children, NULL, NULL, NULL);

	if( !wrapExpr(child, cprec, 18) )
		return JS_FALSE;

	return JS_TRUE;
}

JSBool unparse::expr_unary(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn){

	JSObject *argumentObj;
	if( !getObjPropertyAndConvertToObj(val, "argument", &argumentObj) )
		return JS_FALSE;

	JSString *operatorStr;
	if( !getObjPropertyAndConvertToString(val, "operator", &operatorStr) )
		return JS_FALSE;

	JSString *argumentStr, *opStr;
	
	if ( operatorStr->equals("meta_inline") ){

		unparse up(cx);
		if (!up.unparse_expr(argumentObj, &argumentStr, srcStr(JSSRCNAME_FIVESPACES), 15, false))
			return JS_FALSE;

		jsval	inlineRetVal;
		if (!inlineEvalExecInline(argumentStr, &inlineRetVal))
			return JS_FALSE;

		JSObject *inlineObj;
		if (!JS_ValueToObject(cx, inlineRetVal, &inlineObj))
			return JS_FALSE;

		if (!unParse_start(inlineObj, child))
			return JS_FALSE;
	}
	else {
		
		if ( operatorStr->equals("typeof") || operatorStr->equals("void") || operatorStr->equals("delete") ){
			opStr = joinString(2,operatorStr, srcStr(JSSRCNAME_SPACE));
		}
		else{
			opStr = operatorStr;	
		}

		if( !unparse_expr(argumentObj, &argumentStr, indent, 15, false) )
			return JS_FALSE;


		jsval prefixVal;
		if (!JS_GetProperty(cx, val, "prefix", &prefixVal))
			return JS_FALSE;

		if( ToBoolean(prefixVal) ){
			*child = joinString(2, opStr, argumentStr);
		}
		else{
			*child = joinString(2, argumentStr, opStr);
		}
	
		if( !wrapExpr(child, cprec, 15) )
			return JS_FALSE;
	}

	return JS_TRUE;
}

JSBool unparse::expr_logic(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn){

	JSString *opStr;
	if( !getObjPropertyAndConvertToString(val, "operator", &opStr) )
		return JS_FALSE;

	size_t prec = getPrecedence(opStr);
	if(prec==0){
		const char * chars = (const char *) opStr->getChars(cx);
		JS_ReportError(cx, "unsupposed precedence operator (%s)", chars);
		return JS_FALSE;
	}
	bool parens = (opStr->equals("in") && noIn) || ( cprec>-1 && (size_t) cprec>=prec);
    if (parens)
        noIn = false;

	JSObject *rightObj;
	if( !getObjPropertyAndConvertToObj(val, "right", &rightObj) )
		return JS_FALSE;

	JSString *firstExprStr;
	if( !unparse_expr(rightObj, &firstExprStr, indent, prec, noIn && prec <=11) ){
		return JS_FALSE;
	}

	Vector<JSString*> exprs(cx);
	exprs.append(firstExprStr);
	exprs.append(opStr);

	JSObject *lChildObj;
	if( !getObjPropertyAndConvertToObj(val, "left", &lChildObj) )
		return JS_FALSE;
	
	do{
		JSString *lChildTypeStr;
		if( !getObjPropertyAndConvertToString(val, "type", &lChildTypeStr) )
			return JS_FALSE;

		JSString *valTypeStr;
		if( !getObjPropertyAndConvertToString(val, "type", &valTypeStr) )
			return JS_FALSE;

		int32_t typeEqual;
		if( !JS_CompareStrings(cx, lChildTypeStr, valTypeStr, &typeEqual) ){
			JS_ReportError(cx, "cannot compare strings");
			return JS_FALSE;
		}

		if(typeEqual==0)
			break;
		
		JSString *lChildOpStr;
		if( !getObjPropertyAndConvertToString(lChildObj, "operator", &lChildOpStr) )
			return JS_FALSE;

		size_t childPrec = getPrecedence(lChildOpStr);

		if(prec==childPrec)
			break;


		JSObject *rightChildObj;
		if( !getObjPropertyAndConvertToObj(lChildObj, "right", &rightChildObj) )
			return JS_FALSE;

		JSString *childExprStr;
		if( !unparse_expr(rightChildObj, &childExprStr, indent, prec, noIn && prec <=11) ){
			return JS_FALSE;
		}

		exprs.append(childExprStr);
		exprs.append(lChildOpStr);

		if( !getObjPropertyAndConvertToObj(lChildObj, "left", &lChildObj) )
			return JS_FALSE;

	}while(1);

	JSString *lastExprStr;
	size_t lastPrec = prec-1;
	if( !unparse_expr(lChildObj, &lastExprStr, indent, lastPrec, noIn && lastPrec <=11) ){
		return JS_FALSE;
	}

	exprs.append(lastExprStr);

	*child = joinStringVector(&exprs, srcStr(JSSRCNAME_SPACE), NULL, NULL, true );

	if(parens){
		*child = joinString(3, srcStr(JSSRCNAME_LP), *child, srcStr(JSSRCNAME_RP));
	}

	return JS_TRUE;
}

JSBool unparse::expr_assign(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn){
	JSObject *leftObj;
	if( !getObjPropertyAndConvertToObj(val, "left", &leftObj) )
		return JS_FALSE;

	JSString *leftStr;
	if( !unparse_expr(leftObj, &leftStr, indent, 3, noIn) )
		return JS_FALSE;

	JSObject *rightObj;
	if( !getObjPropertyAndConvertToObj(val, "right", &rightObj) )
		return JS_FALSE;

	JSString *rightStr;
	if( !unparse_expr(rightObj, &rightStr, indent, 2, noIn) )
		return JS_FALSE;

	JSString *opStr;
	if( !getObjPropertyAndConvertToString(val, "operator", &opStr) )
		return JS_FALSE;

	*child = joinString(5, leftStr, srcStr(JSSRCNAME_SPACE), 
		opStr, srcStr(JSSRCNAME_SPACE), rightStr);

	if( !wrapExpr(child, cprec, 3) )
		return JS_FALSE;

	return JS_TRUE;
}

JSBool unparse::expr_func(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn){
	
	jsval idVal;
	if (!JS_GetProperty(cx, val, "id", &idVal)){
		JS_ReportError(cx, "expr_func: object does not contain (id)");
		return JS_FALSE;
	}

	JSString *functionStr;
	if( !functionDeclaration(srcStr(JSSRCNAME_FUNCTION), &functionStr, idVal, val, indent ) )
		return JS_FALSE;
	
	*child = functionStr;

	JSObject *expressionObj;
	if( !getObjPropertyAndConvertToObj(val, "expression", &expressionObj) ){
		if( !wrapExpr(child, cprec, 3) )
			return JS_FALSE;
	}
	else{
		if( !wrapExpr(child, cprec, 19) )
			return JS_FALSE;
	}

	return JS_TRUE;
}

JSBool unparse::expr_objpattern(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn){
	
	JSObject *propertiesObj;
	if( !getObjPropertyAndConvertToObj(val, "properties", &propertiesObj) )
		return JS_FALSE;

	uint32_t propertiesLen;
	if (!JS_GetArrayLength(cx, propertiesObj, &propertiesLen))
		return JS_FALSE;

	Vector<JSString*> children(cx);
	children.append(srcStr(JSSRCNAME_LC));

	for (uint32_t i=0; i<propertiesLen; ++i){

		JSObject *propObj;
		if( !getArrayElementAndConvertToObj(propertiesObj, i, &propObj) )
			return JS_FALSE;

		JSObject *keyObj, *valueObj;
		if( !getObjPropertyAndConvertToObj(propObj, "key", &keyObj) )
			return JS_FALSE;
		if( !getObjPropertyAndConvertToObj(propObj, "value", &valueObj) )
			return JS_FALSE;

		JSString *keyStr, *valueStr;
		if( !unparse_expr(keyObj, &keyStr, srcStr(JSSRCNAME_HASHES), 18, false) )
			return JS_FALSE;
		if( !unparse_expr(valueObj, &valueStr, indent, 2, false) )
			return JS_FALSE;

		children.append(keyStr);
		children.append(srcStr(JSSRCNAME_COLONSPACE));
		children.append(valueStr);

		if( i != propertiesLen-1 )
			children.append(srcStr(JSSRCNAME_COMMASPACE));
			
	}

	children.append(srcStr(JSSRCNAME_RC));
	*child = joinStringVector(&children, NULL, NULL, NULL);

	return JS_TRUE;
}

//metadev
JSBool unparse::expr_metaQuazi(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn){

	jsval programVal = STRING_TO_JSVAL( srcStr(JSSRCNAME_PROGRAM) );

	if(!JS_SetProperty(cx, val, "type", &programVal))
		return JS_FALSE;

	jsval objVal = OBJECT_TO_JSVAL(val);

	JS::Value args[] = { objVal  };
	JS::Value stringlifyStr;
	if (!JS_CallFunctionName(cx, jsonGlobalObj, "stringify", 1, args, &stringlifyStr))
	   return false;

	*child = JS_ValueToString(cx, stringlifyStr);

	return JS_TRUE;
}

//////////////////////////// expression


////////////////////////////
// statement

JSBool unparse::stmt_block(JSObject *val, JSString **child, JSString *indent){
	JSObject *bodyObj;
	if( !getObjPropertyAndConvertToObj(val, "body", &bodyObj) )
		return JS_FALSE;

	Vector<JSString*> stmts(cx);
	blockStmtValueApplier bsva;
	if ( !unparse_values(bodyObj, &stmts, bsva, false ) )
		return JS_FALSE;

	JSString *stmtsStr = joinStringVector(&stmts, NULL, NULL, NULL);

	*child = joinString(7, indent, srcStr(JSSRCNAME_LC), srcStr(JSSRCNAME_NL), 
		stmtsStr, indent, srcStr(JSSRCNAME_RC), srcStr(JSSRCNAME_NL));

	return JS_TRUE;	
}

JSBool unparse::stmt_variableDeclaration(JSObject *val, JSString **child, JSString *indent){
	JSString *kindStr;
	if( !getObjPropertyAndConvertToString(val, "kind", &kindStr) )
		return JS_FALSE;

	JSObject *declObj;
	if( !getObjPropertyAndConvertToObj(val, "declarations", &declObj) )
		return JS_FALSE;

	JSString *declStr;
	if( !declarators( declObj, &declStr, indent, false) )
		return JS_FALSE;

	*child = joinString(5, indent, kindStr, srcStr(JSSRCNAME_SPACE), 
		declStr, srcStr(JSSRCNAME_SEMINL));

	return JS_TRUE;	
}

JSBool unparse::stmt_empty(JSObject *val, JSString **child, JSString *indent){

	*child = joinString(3, indent, srcStr(JSSRCNAME_SEMI), srcStr(JSSRCNAME_NL) );
	return JS_TRUE;	
}

JSBool unparse::stmt_expression(JSObject *val, JSString **child, JSString *indent){

	Vector<JSString*> children(cx);
	children.append(indent);

	JSObject *exprObj;
	if( !getObjPropertyAndConvertToObj(val, "expression", &exprObj) )
		return JS_FALSE;

	JSString *exprStr;
	if (!unparse_expr(exprObj, &exprStr, indent, 0, false))
		return JS_FALSE;

	std::regex regx ("^((function )|(var )|(\\{))");
	char * exprChars = JS_EncodeString(cx, exprStr);

	if( std::regex_search(exprChars, regx) ){
		children.append(srcStr(JSSRCNAME_LP));
		children.append(exprStr);
		children.append(srcStr(JSSRCNAME_RP));
	}
	else{
		children.append(exprStr);
	}

	children.append(srcStr(JSSRCNAME_SEMINL));
	*child = joinStringVector(&children, NULL, NULL, NULL);
	
	return JS_TRUE;	
}

JSBool unparse::stmt_let(JSObject *val, JSString **child, JSString *indent){

	JSObject *headObj;
	if( !getObjPropertyAndConvertToObj(val, "head", &headObj) )
		return JS_FALSE;

	JSObject *bodyObj;
	if( !getObjPropertyAndConvertToObj(val, "body", &bodyObj) )
		return JS_FALSE;

	JSString *headStr;
	if( !declarators( headObj, &headStr, indent, false) )
		return JS_FALSE;

	JSString *bodyStr;
	if(!substmt(bodyObj, &bodyStr, indent, false))
		return JS_FALSE;

	Vector<JSString*> children(cx);

	children.append(indent);
	children.append(srcStr(JSSRCNAME_VARSPACELP));
	children.append(headStr);
	children.append(srcStr(JSSRCNAME_RP));
	children.append(bodyStr);

	*child = joinStringVector(&children, NULL, NULL, NULL);

	return JS_TRUE;	
}

JSBool unparse::stmt_if(JSObject *val, JSString **child, JSString *indent){

	jsval alternateVal;
	if (!JS_GetProperty(cx, val, "alternate", &alternateVal)){
		JS_ReportError(cx, "object has not property (alternate)");
		return JS_FALSE;
	}

	bool isAlternateValNull = alternateVal.isNull();
	bool gotElse = !isAlternateValNull;

	if( gotElse && !alternateVal.isObject()){
		JS_ReportError(cx, "alternate object type is not object or null");
		return JS_FALSE;
	}

	JSObject *testObj;
	if( !getObjPropertyAndConvertToObj(val, "test", &testObj) )
		return JS_FALSE;

	JSString *ifCondStr;
	if( !unparse_expr(testObj, &ifCondStr, indent, 0, false) ){
		return JS_FALSE;
	}

	JSObject *consequentObj;
	if( !getObjPropertyAndConvertToObj(val, "consequent", &consequentObj) )
		return JS_FALSE;

	JSString *ifSubStmtStr;
	if(!substmt(consequentObj, &ifSubStmtStr, indent, gotElse))
		return JS_FALSE;

	Vector<JSString*> children(cx);
	children.append(indent);
	children.append(srcStr(JSSRCNAME_IFSPACELP));
	children.append(ifCondStr);
	children.append(srcStr(JSSRCNAME_RP));
	children.append(ifSubStmtStr);
	
	if(gotElse){
		JSObject *alternateObj;
		if( !getObjPropertyAndConvertToObj(val, "alternate", &alternateObj) )
			return JS_FALSE;

		JSString *elseSubStmtStr;
		if(!substmt(alternateObj, &elseSubStmtStr, indent, false))
			return JS_FALSE;

		children.append(srcStr(JSSRCNAME_ELSE));
		children.append(elseSubStmtStr);
	}


	*child = joinStringVector(&children, NULL, NULL, NULL);
	return JS_TRUE;	
}

JSBool unparse::stmt_while(JSObject *val, JSString **child, JSString *indent){

	JSObject *testObj;
	if( !getObjPropertyAndConvertToObj(val, "test", &testObj) )
		return JS_FALSE;

	JSObject *bodyObj;
	if( !getObjPropertyAndConvertToObj(val, "body", &bodyObj) )
		return JS_FALSE;

	JSString *whileCondStr;
	if( !unparse_expr(testObj, &whileCondStr, indent, 0, false) ){
		return JS_FALSE;
	}

	JSString *bodySubStmtStr;
	if(!substmt(bodyObj, &bodySubStmtStr, indent, false))
		return JS_FALSE;

	*child = joinString(6, indent, srcStr(JSSRCNAME_WHILESPACELP), whileCondStr, 
		srcStr(JSSRCNAME_RP), bodySubStmtStr, indent);

	return JS_TRUE;	
}

JSBool unparse::stmt_for(JSObject *val, JSString **child, JSString *indent){
	Vector<JSString*> children(cx);

	children.append(srcStr(JSSRCNAME_FORSPACELP));

	jsval initVal;
	if (!JS_GetProperty(cx, val, "init", &initVal)){
		JS_ReportError(cx, "object has not property (init)");
		return JS_FALSE;
	}

	if( initVal.isObject() ){
		JSObject *initObj;
		if( !JS_ValueToObject(cx, initVal, &initObj) ){
			JS_ReportError(cx, "cannot convert for->init to object");
			return JS_FALSE;
		}

		JSString *initTypeStr;
		if( !getObjPropertyAndConvertToString(initObj, "type", &initTypeStr) )
			return JS_FALSE;

		if(initTypeStr->equals("VariableDeclaration")){

			JSString *initKindStr;
			if( !getObjPropertyAndConvertToString(initObj, "kind", &initKindStr) )
				return JS_FALSE;

			JSObject *declObj;
			if( !getObjPropertyAndConvertToObj(initObj, "declarations", &declObj) )
				return JS_FALSE;

			JSString *declStr;
			if( !declarators( declObj, &declStr, indent, true) )
				return JS_FALSE;

			children.append(initKindStr);
			children.append(srcStr(JSSRCNAME_SPACE));
			children.append(declStr);
		}
		else{
			JSString *initExprStr;
			if (!unparse_expr(initObj, &initExprStr, indent, 0, true))
				return JS_FALSE;

			children.append(initExprStr);
		}
	}

	children.append(srcStr(JSSRCNAME_SEMI));

	jsval testVal;
	if (!JS_GetProperty(cx, val, "test", &testVal)){
		JS_ReportError(cx, "object has not property (test)");
		return JS_FALSE;
	}

	if(testVal.isObject()){
		JSObject *testExprObj;
		if( !JS_ValueToObject(cx, testVal, &testExprObj) ){
			JS_ReportError(cx, "cannot convert for->test to object");
			return JS_FALSE;
		}

		JSString *testExprStr;
		if (!unparse_expr(testExprObj, &testExprStr, indent, 0, false))
			return JS_FALSE;

		children.append(srcStr(JSSRCNAME_SPACE));
		children.append(testExprStr);
	}
	
	children.append(srcStr(JSSRCNAME_SEMI));

	jsval updateVal;
	if (!JS_GetProperty(cx, val, "update", &updateVal)){
		JS_ReportError(cx, "object has not property (update)");
		return JS_FALSE;
	}

	if(updateVal.isObject()){
		JSObject *updateExprObj;
		if( !JS_ValueToObject(cx, updateVal, &updateExprObj) ){
			JS_ReportError(cx, "cannot convert for->update to object");
			return JS_FALSE;
		}

		JSString *updateExprStr;
		if (!unparse_expr(updateExprObj, &updateExprStr, indent, 0, false))
			return JS_FALSE;

		children.append(srcStr(JSSRCNAME_SPACE));
		children.append(updateExprStr);
	}

	children.append(srcStr(JSSRCNAME_RP));

	JSObject *bodyObj;
	if( !getObjPropertyAndConvertToObj(val, "body", &bodyObj) )
		return JS_FALSE;

	JSString *forBodyStr;
	if(!substmt(bodyObj, &forBodyStr, indent, false))
		return JS_FALSE;

	children.append(forBodyStr);

	*child = joinStringVector(&children, NULL, NULL, NULL);

	return JS_TRUE;	
}

JSBool unparse::stmt_forin(JSObject *val, JSString **child, JSString *indent){
	
	JSString *forHeadStr;
	if ( !forHead(val, &forHeadStr, indent) )
		return JS_FALSE;

	JSObject *bodyObj;
	if( !getObjPropertyAndConvertToObj(val, "body", &bodyObj) )
		return JS_FALSE;

	JSString *bodyStr;
	if(!substmt(bodyObj, &bodyStr, indent, false))
		return JS_FALSE;

	*child = joinString(3, indent, forHeadStr, bodyStr );

	return JS_TRUE;	
}

JSBool unparse::stmt_dowhile(JSObject *val, JSString **child, JSString *indent){
	
	JSObject *bodyObj;
	if( !getObjPropertyAndConvertToObj(val, "body", &bodyObj) )
		return JS_FALSE;

	JSString *bodyStr;
	if(!substmt(bodyObj, &bodyStr, indent, true))
		return JS_FALSE;

	JSObject *testObj;
	if( !getObjPropertyAndConvertToObj(val, "test", &testObj) )
		return JS_FALSE;

	JSString *testStr;
	if( !unparse_expr(testObj, &testStr, indent, 0, false) )
		return JS_FALSE;

	*child = joinString(7, indent, srcStr(JSSRCNAME_DO), bodyStr,
						srcStr(JSSRCNAME_WHILESPACELP), testStr,
						srcStr(JSSRCNAME_RP), srcStr(JSSRCNAME_SEMINL));

	return JS_TRUE;	
}

JSBool unparse::stmt_continue(JSObject *val, JSString **child, JSString *indent){
	Vector<JSString*> children(cx);

	children.append(indent);
	children.append(srcStr(JSSRCNAME_CONTINUE));

	jsval labelVal;
	if (!JS_GetProperty(cx, val, "label", &labelVal))
		return JS_FALSE;

	if( labelVal.isObject() ){
		JSObject *labelObj;
		if( !JS_ValueToObject(cx, labelVal, &labelObj) )
			return JS_FALSE;

		JSString *nameStr;
		if( !getObjPropertyAndConvertToString(labelObj, "name", &nameStr) )
			return JS_FALSE;

		children.append(srcStr(JSSRCNAME_SPACE));
		children.append(nameStr);
	}

	children.append(srcStr(JSSRCNAME_SEMINL));
	*child = joinStringVector(&children, NULL, NULL, NULL);

	return JS_TRUE;	
}

JSBool unparse::stmt_break(JSObject *val, JSString **child, JSString *indent){
	Vector<JSString*> children(cx);

	children.append(indent);
	children.append(srcStr(JSSRCNAME_BREAK));

	jsval labelVal;
	if (!JS_GetProperty(cx, val, "label", &labelVal))
		return JS_FALSE;

	if( labelVal.isObject() ){
		JSObject *labelObj;
		if( !JS_ValueToObject(cx, labelVal, &labelObj) )
			return JS_FALSE;

		JSString *nameStr;
		if( !getObjPropertyAndConvertToString(labelObj, "name", &nameStr) )
			return JS_FALSE;

		children.append(srcStr(JSSRCNAME_SPACE));
		children.append(nameStr);
	}

	children.append(srcStr(JSSRCNAME_SEMINL));
	*child = joinStringVector(&children, NULL, NULL, NULL);

	return JS_TRUE;	
}

JSBool unparse::stmt_return(JSObject *val, JSString **child, JSString *indent){
	
	jsval argVal;
	if (!JS_GetProperty(cx, val, "argument", &argVal)){
		JS_ReportError(cx, "object has not property (argument)");
		return JS_FALSE;
	}

	Vector<JSString*> children(cx);
	children.append(indent);
	children.append(srcStr(JSSRCNAME_RETURN));
	if(argVal.isObject()){
		JSObject *argObj;
		if( !JS_ValueToObject(cx, argVal, &argObj) ){
			return JS_FALSE;
		}

		JSString *exprStr;
		if( !unparse_expr(argObj, &exprStr, indent, 17, false) ){
			return JS_FALSE;
		}

		children.append(srcStr(JSSRCNAME_SPACE));
		children.append(exprStr);

	}
	children.append(srcStr(JSSRCNAME_SEMINL));

	*child = joinStringVector(&children, NULL, NULL, NULL );

	return JS_TRUE;	
}

JSBool unparse::stmt_with(JSObject *val, JSString **child, JSString *indent){
	
	JSObject *objectObj;
	if( !getObjPropertyAndConvertToObj(val, "object", &objectObj) )
		return JS_FALSE;

	JSString *objectStr;
	if( !unparse_expr(objectObj, &objectStr, indent, 0, false) )
		return JS_FALSE;
	
	JSObject *bodyObj;
	if( !getObjPropertyAndConvertToObj(val, "body", &bodyObj) )
		return JS_FALSE;

	JSString *bodyStr;
	if(!substmt(bodyObj, &bodyStr, indent, false))
		return JS_FALSE;

	*child = joinString(4, indent, srcStr(JSSRCNAME_WITHSPACELP),
						srcStr(JSSRCNAME_RP), bodyStr);
	
	return JS_TRUE;	
}

JSBool unparse::stmt_labeled(JSObject *val, JSString **child, JSString *indent){
	
	JSObject *labelObj;
	if( !getObjPropertyAndConvertToObj(val, "label", &labelObj) )
		return JS_FALSE;

	JSString *nameStr;
	if( !getObjPropertyAndConvertToString(labelObj, "name", &nameStr) )
		return JS_FALSE;

	JSObject *bodyObj;
	if( !getObjPropertyAndConvertToObj(val, "body", &bodyObj) )
		return JS_FALSE;

	JSString *bodyStr;
	if (!unparse_sourceElement(bodyObj, &bodyStr, indent))
			return JS_FALSE;

	*child = joinString(3, nameStr, srcStr(JSSRCNAME_COLONSPACE), bodyStr);

	return JS_TRUE;	
}

JSBool unparse::stmt_switch(JSObject *val, JSString **child, JSString *indent){
	
	Vector<JSString*> children(cx);

	JSObject *discriminantObj;
	if( !getObjPropertyAndConvertToObj(val, "discriminant", &discriminantObj) )
		return JS_FALSE;

	JSString *discriminantStr;
	if( !unparse_expr(discriminantObj, &discriminantStr, indent, 0, false) )
		return JS_FALSE;

	children.append(indent);
	children.append(srcStr(JSSRCNAME_SWITCH));
	children.append(srcStr(JSSRCNAME_SPACE));
	children.append(srcStr(JSSRCNAME_LP));
	children.append(discriminantStr);
	children.append(srcStr(JSSRCNAME_RP));
	children.append(srcStr(JSSRCNAME_SPACE));
	children.append(srcStr(JSSRCNAME_LC));
	children.append(srcStr(JSSRCNAME_NL));

	JSString *deeperStr;
	deeperStr = joinString(2, indent, srcStr(JSSRCNAME_FIVESPACES));

	JSObject *casesObj;
	if( !getObjPropertyAndConvertToObj(val, "cases", &casesObj) )
		return JS_FALSE;

	uint32_t casesLen;
	if (!JS_GetArrayLength(cx, casesObj, &casesLen))
		return JS_FALSE;

	for (uint32_t i=0; i<casesLen; ++i){

		JSObject *caseObj;
		if( !getArrayElementAndConvertToObj(casesObj, i, &caseObj) )
			return JS_FALSE;

		children.append(indent);

		jsval testVal;
		if (!JS_GetProperty(cx, caseObj, "test", &testVal))
			return JS_FALSE;

		if( testVal.isObject() ){
			JSObject *testObj;
			if( !JS_ValueToObject(cx, testVal, &testObj) )
				return JS_FALSE;
				
			JSString *testStr;
			if( !unparse_expr(testObj, &testStr, indent, 0, false) )
				return JS_FALSE;

			children.append(srcStr(JSSRCNAME_CASE));
			children.append(srcStr(JSSRCNAME_SPACE));
			children.append(testStr);
		}
		else{
			children.append(srcStr(JSSRCNAME_DEFAULT));
		}
		children.append(srcStr(JSSRCNAME_COLON));
		children.append(srcStr(JSSRCNAME_NL));

		JSObject *stmtsObj;
		if( !getObjPropertyAndConvertToObj(caseObj, "consequent", &stmtsObj) )
			return JS_FALSE;

		uint32_t stmtsLen;
		if (!JS_GetArrayLength(cx, stmtsObj, &stmtsLen))
			return JS_FALSE;

		for (uint32_t j=0; j<stmtsLen; ++j){
			JSObject *stmtObj;
			if( !getArrayElementAndConvertToObj(stmtsObj, j, &stmtObj) )
				return JS_FALSE;

			JSString *stmtStr;
			if (!unparse_sourceElement(stmtObj, &stmtStr, deeperStr))
				return JS_FALSE;

			children.append(stmtStr);
		}
	}

	children.append(indent);
	children.append(srcStr(JSSRCNAME_RC));
	children.append(srcStr(JSSRCNAME_NL));

	*child = joinStringVector(&children, NULL, NULL, NULL);

	return JS_TRUE;	
}

JSBool unparse::stmt_throw(JSObject *val, JSString **child, JSString *indent){
	
	JSObject *argumentObj;
	if( !getObjPropertyAndConvertToObj(val, "argument", &argumentObj) )
		return JS_FALSE;

	JSString *argumentStr;
	if( !unparse_expr(argumentObj, &argumentStr, indent, 0, false) )
		return JS_FALSE;

	*child = joinString(4, indent, srcStr(JSSRCNAME_THROWSPACE),
						argumentStr, srcStr(JSSRCNAME_SEMINL));

	return JS_TRUE;	
}

JSBool unparse::stmt_try(JSObject *val, JSString **child, JSString *indent){
	Vector<JSString*> children(cx);

	JSObject *blockObj;
	if( !getObjPropertyAndConvertToObj(val, "block", &blockObj) )
		return JS_FALSE;

	JSString *blockStr;
	if(!substmt(blockObj, &blockStr, indent, true))
		return JS_FALSE;

	children.append(indent);
	children.append(srcStr(JSSRCNAME_TRY));
	children.append(blockStr);

	JSObject *handlerObj;
	if( !getObjPropertyAndConvertToObj(val, "handler", &handlerObj) )
		return JS_FALSE;

	if( handlerObj ) {
		JSObject *paramObj;
		if( !getObjPropertyAndConvertToObj(handlerObj, "param", &paramObj) )
			return JS_FALSE;

		JSString *paramStr;
		if( !unparse_expr(paramObj, &paramStr, srcStr(JSSRCNAME_HASHES), 0, false) )
			return JS_FALSE;

		children.append(srcStr(JSSRCNAME_CATCH));
		children.append(srcStr(JSSRCNAME_SPACE));
		children.append(srcStr(JSSRCNAME_LP));
		children.append(paramStr);

		JSObject *guardObj;
		if( !getObjPropertyAndConvertToObj(val, "guard", &guardObj) )
			return JS_FALSE;

		if ( guardObj ){
			JSString *guardStr;
			if( !unparse_expr(guardObj, &guardStr, indent, 0, false) )
				return JS_FALSE;

			children.append(srcStr(JSSRCNAME_IFSPACELP));
			children.append(guardStr);
		}

		jsval finalizerVal;
		if (!JS_GetProperty(cx, val, "finalizer", &finalizerVal))
			return JS_FALSE;

		JSObject *bodyObj;
		if( !getObjPropertyAndConvertToObj(handlerObj, "body", &bodyObj) )
			return JS_FALSE;

		JSString *bodyStr;
		if(!substmt(bodyObj, &bodyStr, indent, finalizerVal.isObject()))
			return JS_FALSE;

		children.append(srcStr(JSSRCNAME_RP));
		children.append(bodyStr);
	}

	jsval finalizerVal;
	if (!JS_GetProperty(cx, val, "finalizer", &finalizerVal))
		return JS_FALSE;

	if( finalizerVal.isObject() ){
		JSObject *finalizerObj;
		if( !JS_ValueToObject(cx, finalizerVal, &finalizerObj) )
			return JS_FALSE;

		JSString *finalizerStr;
		if(!substmt(finalizerObj, &finalizerStr, indent, false))
			return JS_FALSE;

		children.append(srcStr(JSSRCNAME_FINALLY));
		children.append(finalizerStr);
	}

	*child = joinStringVector(&children, NULL, NULL, NULL);

	return JS_TRUE;	
}

JSBool unparse::stmt_debugger(JSObject *val, JSString **child, JSString *indent){
	
	*child = joinString(2, indent, srcStr(JSSRCNAME_DEBUGGERSEMI));

	return JS_TRUE;	
}

JSBool unparse::stmt_functiondeclaration(JSObject *val, JSString **child, JSString *indent){
	jsval idVal;
	if (!JS_GetProperty(cx, val, "id", &idVal)){
		JS_ReportError(cx, "object has not property (expression)");
		return JS_FALSE;
	}

	JSString *funcDeclStr;
	if( !functionDeclaration(srcStr(JSSRCNAME_FUNCTION), &funcDeclStr, idVal, val, indent) )
		return JS_FALSE;

	jsval exprPropVal;
	if (!JS_GetProperty(cx, val, "expression", &exprPropVal)){
		JS_ReportError(cx, "object has not property (expression)");
		return JS_FALSE;
	}

	*child = joinString(3, indent, funcDeclStr, 
		srcStr( exprPropVal.isNullOrUndefined() ? JSSRCNAME_SEMINL : JSSRCNAME_NL));
	return JS_TRUE;	
}

/////////////////////

unparse::unparse(JSContext *x) : precedence(x), stringifyExprHandlerMapInst(x), standarJsSrcNames(x), 
	stringifyStmtHandlerMapInst(x), inlineEvaluateCode(x), cx(x)
{

	JSObject *globalObj = cx->global();
	if( !getObjPropertyAndConvertToObj(globalObj, "JSON", &jsonGlobalObj) )
		JS_ReportError(cx, "cannot get JSON object from global object");

	stringifyExprHandlerMapInst.init();
	stringifyExprHandlerMapInst.put("ArrayExpression", &unparse::expr_array);
	stringifyExprHandlerMapInst.put("ArrayPattern", &unparse::expr_array);
	stringifyExprHandlerMapInst.put("ObjectExpression", &unparse::expr_obj);
	stringifyExprHandlerMapInst.put("GraphExpression", &unparse::expr_graph);
	stringifyExprHandlerMapInst.put("GraphIndexExpression", &unparse::expr_graphIndx);
	stringifyExprHandlerMapInst.put("LetExpression", &unparse::expr_let);
	stringifyExprHandlerMapInst.put("GeneratorExpression", &unparse::expr_gen);
	stringifyExprHandlerMapInst.put("ComprehensionExpression", &unparse::expr_comprehen);
	stringifyExprHandlerMapInst.put("YieldExpression", &unparse::expr_yield);
	stringifyExprHandlerMapInst.put("SequenceExpression", &unparse::expr_sequence);
	stringifyExprHandlerMapInst.put("ConditionalExpression", &unparse::expr_cond);
	stringifyExprHandlerMapInst.put("Identifier", &unparse::expr_indent);
	stringifyExprHandlerMapInst.put("Literal", &unparse::expr_literal);
	stringifyExprHandlerMapInst.put("CallExpression", &unparse::expr_call);
	stringifyExprHandlerMapInst.put("NewExpression", &unparse::expr_new);
	stringifyExprHandlerMapInst.put("ThisExpression", &unparse::expr_this);
	stringifyExprHandlerMapInst.put("MemberExpression", &unparse::expr_member);
	stringifyExprHandlerMapInst.put("MetaQuaziStatement", &unparse::expr_metaQuazi);
	stringifyExprHandlerMapInst.put("UnaryExpression", &unparse::expr_unary);
	stringifyExprHandlerMapInst.put("UpdateExpression", &unparse::expr_unary);
	stringifyExprHandlerMapInst.put("LogicalExpression", &unparse::expr_logic);
	stringifyExprHandlerMapInst.put("BinaryExpression", &unparse::expr_logic);
	stringifyExprHandlerMapInst.put("AssignmentExpression", &unparse::expr_assign);
	stringifyExprHandlerMapInst.put("FunctionExpression", &unparse::expr_func);
	stringifyExprHandlerMapInst.put("ObjectPattern", &unparse::expr_objpattern);

	stringifyStmtHandlerMapInst.init();
	stringifyStmtHandlerMapInst.put("BlockStatement", &unparse::stmt_block);
	stringifyStmtHandlerMapInst.put("VariableDeclaration", &unparse::stmt_variableDeclaration);
	stringifyStmtHandlerMapInst.put("EmptyStatement", &unparse::stmt_empty);
	stringifyStmtHandlerMapInst.put("ExpressionStatement", &unparse::stmt_expression);
	stringifyStmtHandlerMapInst.put("LetStatement", &unparse::stmt_let);
	stringifyStmtHandlerMapInst.put("IfStatement", &unparse::stmt_if);
	stringifyStmtHandlerMapInst.put("WhileStatement", &unparse::stmt_while);
	stringifyStmtHandlerMapInst.put("ForStatement", &unparse::stmt_for);
	stringifyStmtHandlerMapInst.put("ForInStatement", &unparse::stmt_forin);
	stringifyStmtHandlerMapInst.put("DoWhileStatement", &unparse::stmt_dowhile);
	stringifyStmtHandlerMapInst.put("ContinueStatement", &unparse::stmt_continue);
	stringifyStmtHandlerMapInst.put("BreakStatement", &unparse::stmt_break);
	stringifyStmtHandlerMapInst.put("ReturnStatement", &unparse::stmt_return);
	stringifyStmtHandlerMapInst.put("WithStatement", &unparse::stmt_with);
	stringifyStmtHandlerMapInst.put("LabeledStatement", &unparse::stmt_labeled);
	stringifyStmtHandlerMapInst.put("SwitchStatement", &unparse::stmt_switch);
	stringifyStmtHandlerMapInst.put("ThrowStatement", &unparse::stmt_throw);
	stringifyStmtHandlerMapInst.put("TryStatement", &unparse::stmt_try);
	stringifyStmtHandlerMapInst.put("DebuggerStatement", &unparse::stmt_debugger);
	stringifyStmtHandlerMapInst.put("FunctionDeclaration", &unparse::stmt_functiondeclaration);

	precedence.init();
	precedence.put("||", 5);
	precedence.put("&&", 6);
	precedence.put("|", 7);
	precedence.put("^", 8);
	precedence.put("&", 9);
	precedence.put("==", 10);
	precedence.put("!=", 10);
	precedence.put("===", 10);
	precedence.put("!==", 10);
	precedence.put("<", 11);
	precedence.put("<=", 11);
	precedence.put(">", 11);
	precedence.put(">=", 11);
	precedence.put("in", 11);
	precedence.put("instanceof", 11);
	precedence.put("<<", 12);
	precedence.put(">>", 12);
	precedence.put(">>>", 12);
	precedence.put("+", 13);
	precedence.put("-", 13);
	precedence.put("*", 14);
	precedence.put("/", 14);
	precedence.put("%", 14);

	char *standardNames[] = {
		" ",
		"    ",
		"do", 
		"while (", 
		"(", ")", 
		"{", "}",
		"[", "]",
		";",
		" );",
		"?",
		"\n", 
		";\n",
		"switch",
		"case", 
		"default", 
		":",
		": ",
		"#",
		"####",
		"\"",
		"if (",
		"else",
		"return",
		"function",
		"=",
		".",
		",",
		", ",
		"for",
		"for (",
		"each",
		"in",
		"yield",
		"new",
		"continue",
		"break",
		"throw ",
		"try",
		"catch",
		"finally",
		"with (",
		"var (",
		"this",
		"debugger;",
		"inlineCall",
		"Program",
		" at "
	};

	for( size_t i=0; i<JSSRCNAME_END; ++i ){
		JSString *name = JS_NewStringCopyZ(cx, standardNames[i]);
		if(!name){
			JS_ReportError(cx, "cannot create jsstring for (%s)", standardNames[i]);
		}
		standarJsSrcNames[i] = name;
	}
}

///////////////////////////////
// inline evaluator

JSBool unparse::inlineEvalAppendCode(JSString *code)
{
	return inlineEvaluateCode.append(code) 
			&& inlineEvaluateCode.append(srcStr(JSSRCNAME_NL));
}

JSBool unparse::inlineEvalExecInline(JSString *code, jsval *inlineRetVal)
{
	JSString *snippetCode = joinStringVector(&inlineEvaluateCode, NULL, NULL, NULL);
	JSString *evaluatedCode = joinString(4, snippetCode, srcStr(JSSRCNAME_INLINECALL), code, srcStr(JSSRCNAME_SPACERPSEMI));

	char *source = JS_EncodeString(cx, evaluatedCode);
	std::cout<< "\n\ninline: \n===================================================\n" 
			<< source 
			<< "\n===================================================\n\n";
	if (!JS_EvaluateScript(cx, cx->global(), source, strlen(source),
							"inlineEval.js", 1, inlineRetVal))
		return JS_FALSE;

	return JS_TRUE;
}

///////////////////////
// object stringify

JSBool stringifyObject(JSObject *obj, JSString **s)
{
	return JS_TRUE;
}

///////////////////////////////
// helpers

JSBool unparse::declarators(JSObject *decls, JSString **s, JSString *indent, bool noIn)
{
	Vector<JSString*> children(cx);

	declValueApplier dva;
	if ( !unparse_values(decls, &children, dva, noIn) )
		return JS_FALSE;

	*s = joinStringVector(&children, srcStr(JSSRCNAME_COMMASPACE), NULL, NULL);

	return JS_TRUE;
}

JSBool unparse::wrapExpr(JSString **s, int cprec, int xprec)
{
	if(xprec <= cprec){
		*s = joinString(3, srcStr(JSSRCNAME_LP), *s, srcStr(JSSRCNAME_RP)); 
	}
	return JS_TRUE;
}

JSBool unparse::substmt(JSObject *obj, JSString **s, JSString *indent, bool more)
{
	JSString *typeStr;
	if( !getObjPropertyAndConvertToString(obj, "type", &typeStr) )
		return JS_FALSE;

	JSString *body;
	if(typeStr->equals("BlockStatement")){
		if (!unparse_sourceElement(obj, &body, indent))
			return JS_FALSE;
		if(more){
			*s = JS_NewDependentString(cx, body, indent->length(), body->length() - indent->length() - 1);
			*s = joinString(2, *s, srcStr(JSSRCNAME_SPACE)); 
		}
		else{
			*s = JS_NewDependentString(cx, body, indent->length(), body->length() - indent->length());
		}
		*s = joinString(2, srcStr(JSSRCNAME_SPACE), *s); 

	}
	else{
		indent = joinString(2, indent, srcStr(JSSRCNAME_FIVESPACES));
		if (!unparse_sourceElement(obj, &body, indent))
			return JS_FALSE;

		*s = more ? joinString(3, srcStr(JSSRCNAME_NL), body, indent) :
					joinString(2, srcStr(JSSRCNAME_NL), body);

	}

	return JS_TRUE;
}

JSBool unparse::args(JSObject *values, JSString **s, JSString *indent)
{
	Vector<JSString*> children(cx);

	argsValueApplier ava;
	if ( !unparse_values(values, &children, ava, false ) )
		return JS_FALSE;

	*s = children.length() > 0 ? 
		joinStringVector(&children, srcStr(JSSRCNAME_COMMASPACE), 
		srcStr(JSSRCNAME_LP), srcStr(JSSRCNAME_RP))
		: joinString(2, srcStr(JSSRCNAME_LP), srcStr(JSSRCNAME_RP));

	return JS_TRUE;
}

JSBool unparse::params(JSObject *values, JSString **s, JSString *indent)
{
	Vector<JSString*> children(cx);

	paramsValueApplier ava(srcStr(JSSRCNAME_HASHES));
	if ( !unparse_values(values, &children, ava, false) )
		return JS_FALSE;

	if( children.empty() ){
		children.append(srcStr(JSSRCNAME_LP));
		children.append(srcStr(JSSRCNAME_RP));
		*s = joinStringVector(&children, NULL, NULL, NULL);
	}
	else{
		*s = joinStringVector(&children, srcStr(JSSRCNAME_COMMASPACE),
			srcStr(JSSRCNAME_LP), srcStr(JSSRCNAME_RP));
	}
	return JS_TRUE;
}

// TODO Needs more code relating the properties of the object
JSBool unparse::unexpected(JSObject *node, JSString **s){
	Vector<JSString*> children(cx);

	JSString *typeStr;
	if( !getObjPropertyAndConvertToString(node, "type", &typeStr) )
		return JS_FALSE;

	JSObject *locObj, *locStartObj;
	if( getObjPropertyAndConvertToObj(node,"loc", &locObj ) ){

		if( !getObjPropertyAndConvertToObj(locObj, "start", &locStartObj) )
			return JS_FALSE;

		JSString *sourceStr, *startLineStr;
		if( !getObjPropertyAndConvertToString(locObj, "source", &sourceStr) )
			return JS_FALSE;
		if( !getObjPropertyAndConvertToString(locStartObj, "line", &startLineStr) )
			return JS_FALSE;

		children.append(srcStr(JSSRCNAME_SPACEATSPACE));
		children.append(sourceStr);
		children.append(srcStr(JSSRCNAME_COLON));
	}
	
	children.append(JS_NewStringCopyZ(cx,"Unexpected parse node type: "));

	*s = joinStringVector(&children, NULL, NULL, NULL);

	return JS_TRUE;
}

JSBool unparse::forHead(JSObject *val, JSString **s, JSString *indent){

	JSString *lhsStr = NULL;
	Vector<JSString*> children(cx);
	Vector<JSString*> lhsVector(cx);

	JSObject *leftObj;
	if( !getObjPropertyAndConvertToObj(val, "left", &leftObj) )
		return JS_FALSE;

	JSString *typeStr;
	if( !getObjPropertyAndConvertToString(leftObj, "type", &typeStr) )
		return JS_FALSE;

	if( typeStr->equals("VariableDeclaration") ){
		JSString *kindStr;
		if( !getObjPropertyAndConvertToString(leftObj, "kind", &kindStr) )
			return JS_FALSE;

		JSObject *declarObj;
		if( !getObjPropertyAndConvertToObj(leftObj, "declarations", &declarObj) )
			return JS_FALSE;

		JSString *declarStr;
		if ( !declarators(declarObj, &declarStr, indent, true) )
			return JS_FALSE;

		lhsVector.append(kindStr);
		lhsVector.append(srcStr(JSSRCNAME_SPACE));
		lhsVector.append(declarStr);
	}
	else{
		JSString *expressionStr;
		if( !unparse_expr(leftObj, &expressionStr, indent, 0, false) )
			return JS_FALSE;

		lhsVector.append(expressionStr);
	}

	lhsStr = joinStringVector(&lhsVector, NULL, NULL, NULL);

	children.append(srcStr(JSSRCNAME_FOR));
	children.append(srcStr(JSSRCNAME_SPACE));

	jsval eachVal;
	if ( !JS_GetProperty(cx, val, "each", &eachVal) )
		return JS_FALSE;

	if ( ToBoolean(eachVal) )
		children.append(srcStr(JSSRCNAME_EACH));

	children.append(srcStr(JSSRCNAME_LP));
	children.append(lhsStr);
	children.append(srcStr(JSSRCNAME_SPACE));
	children.append(srcStr(JSSRCNAME_IN));
	children.append(srcStr(JSSRCNAME_SPACE));

	JSObject *rightObj;
	if( !getObjPropertyAndConvertToObj(val, "right", &rightObj) )
		return JS_FALSE;

	JSString *rightStr;
	if( !unparse_expr(rightObj, &rightStr, indent, 0, false) )
		return JS_FALSE;

	children.append(srcStr(JSSRCNAME_RP));

	*s = joinStringVector(&children, NULL, NULL, NULL);

	return JS_TRUE;
}

JSBool unparse::comprehension(JSObject *val, JSString **s, JSString *indent){
	Vector<JSString*> children(cx);

	JSObject *bodyObj;
	if( !getObjPropertyAndConvertToObj(val, "body", &bodyObj) )
		return JS_FALSE;

	JSString *bodyStr;
	if( !unparse_expr(bodyObj, &bodyStr, indent, 2, false) )
		return JS_FALSE;

	children.append(bodyStr);

	JSObject *blocksObj;
	if( !getObjPropertyAndConvertToObj(val, "blocks", &blocksObj) )
		return JS_FALSE;

	uint32_t blocksLen;
	if (!JS_GetArrayLength(cx, blocksObj, &blocksLen))
		return JS_FALSE;

	for( uint32_t i=0; i<blocksLen; ++i ){
		JSObject *blocksNodeObj;
		if( !getArrayElementAndConvertToObj(blocksObj, i, &blocksNodeObj) )
			return JS_FALSE;

		children.append(srcStr(JSSRCNAME_SPACE));

		JSString *forHeadStr;
		if( !forHead(blocksNodeObj, &forHeadStr, indent) )
			return JS_FALSE;

		children.append(forHeadStr);
	}

	jsval filterVal;
	if (!JS_GetProperty(cx, val, "filter", &filterVal))
		return JS_FALSE;

	if( filterVal.isObject() ){
		children.append(srcStr(JSSRCNAME_IFSPACELP));

		JSObject *filterObj;
		if( !JS_ValueToObject(cx, filterVal, &filterObj) )
			return JS_FALSE;

		JSString *filterStr;
		if( !unparse_expr(filterObj, &filterStr, indent, 0, false) )
			return JS_FALSE;

		children.append(filterStr);
		children.append(srcStr(JSSRCNAME_RP));
	}

	*s = joinStringVector(&children, NULL, NULL, NULL);

	return JS_TRUE;
}


JSBool unparse::functionDeclaration(JSString *funcInitStr, JSString **s, 
		jsval id, JSObject *val, JSString *indent){
	bool isIdNull = id.isNullOrUndefined();
	JSString *funcNameStr = NULL;

	if(!isIdNull){
		JSObject *idObj;
		if( !JS_ValueToObject(cx, id, &idObj) ){
			JS_ReportError(cx, "functionDeclaration id is not an object");
			return JS_FALSE;
		}

		if( !unparse_expr(idObj, &funcNameStr, srcStr(JSSRCNAME_HASHES), 18, false) ){
			return JS_FALSE;
		}
	}

	jsval exprPropStr;
	if (!JS_GetProperty(cx, val, "expression", &exprPropStr)){
		JS_ReportError(cx, "object has not property (expression)");
		return JS_FALSE;
	}

	JSObject *bodyObj;
	if( !getObjPropertyAndConvertToObj(val, "body", &bodyObj) )
		return JS_FALSE;

	JSString *bodyStr;
	if( exprPropStr.isNullOrUndefined() || exprPropStr.isFalse() ){
		if(!substmt(bodyObj, &bodyStr, indent, false))
			return JS_FALSE;
		// todo: trim to right bodyStr
	}
	else{
		if( !unparse_expr(bodyObj, &bodyStr, indent, 2, false) ){
			return JS_FALSE;
		}

		jschar firstBodyChar;
		if(!bodyStr->getChar(cx, 0, &firstBodyChar)){
			const char * chars = (const char *) bodyStr->getChars(cx);
			JS_ReportError(cx, "getting first character of (%s) expression", chars);
			return JS_FALSE;
		}
		bodyStr = firstBodyChar=='{' ?  
					joinString(4, srcStr(JSSRCNAME_SPACE), srcStr(JSSRCNAME_LP), 
							bodyStr, srcStr(JSSRCNAME_RP))
					: joinString(2, srcStr(JSSRCNAME_SPACE), bodyStr);
		
	}

	JSObject *paramsObj;
	if( !getObjPropertyAndConvertToObj(val, "params", &paramsObj) )
		return JS_FALSE;

	JSString *paramsStr;
	if(!params(paramsObj, &paramsStr, indent)){
		return JS_FALSE;
	}

	Vector<JSString*> children(cx);
	children.append(funcInitStr);
	children.append(srcStr(JSSRCNAME_SPACE));
	if(funcNameStr)
		children.append(funcNameStr);
	children.append(paramsStr);
	children.append(bodyStr);

	*s = joinStringVector(&children, NULL, NULL, NULL );
	
	inlineEvalAppendCode(*s);

	return JS_TRUE;
}

JSString* unparse::prefixSuffixConcatString(JSString *sep, Vector<JSString*> *strs, 
	JSString *str, size_t index)
{
	if(sep){
		str = JS_ConcatStrings(cx, str, sep);
	}
	return JS_ConcatStrings(cx, str, (*strs)[index]);
}

JSBool unparse::isBadIdentifier(JSObject *val, JSBool *isBad){
	JSString *typeStr;
	if( !getObjPropertyAndConvertToString(val, "type", &typeStr) )
		return JS_FALSE;

	if (!typeStr->equals("Identifier")){
		*isBad = JS_FALSE;
		return JS_TRUE;
	}
	
	JSString *nameStr;
	if( !getObjPropertyAndConvertToString(val, "name", &nameStr) )
		return JS_FALSE;

	std::regex regx ("^[_$A-Za-z][_$A-Za-z0-9]*$");
	char * nameChars = JS_EncodeString(cx, nameStr);

	*isBad = (JSBool) ( !std::regex_search(nameChars, regx) );

	return JS_TRUE;
}

JSString* unparse::joinString(size_t num, ...)
{
	JS_ASSERT(num>1);
	va_list args;
	va_start ( args, num );
	JSString *str = va_arg ( args, JSString * );
	if(!str)
		str = cx->runtime()->emptyString;
	for ( size_t i = 1; i < num; ++i ){  
		JSString *arg = va_arg ( args, JSString * );
		if(arg){
			str = JS_ConcatStrings(cx, str, arg);
		}
	}
	va_end ( args );

	return str;
}

JSString * unparse::joinStringVector(Vector<JSString*> *strs, 
	JSString* sep, JSString* prf, JSString* suf, bool reverse)
{
	size_t strsLn = strs->length();
	if( strsLn==0 ){
		return NULL;
	}

	JSString *str = reverse ? (*strs)[strsLn-1] : (*strs)[0];
	if(reverse){
		for( size_t i=strsLn-2; i!=-1; --i ){
			str = prefixSuffixConcatString(sep, strs, str, i);
		}
	}
	else{
		for( size_t i=1; i<strsLn; ++i ){
			str = prefixSuffixConcatString(sep, strs, str, i);
		}
	}

	return joinString(3, prf, str, suf);
}

JSBool unparse::getObjPropertyAndConvertToObj(JSObject *obj, const char *key, 
	JSObject **objVal)
{
	jsval val;
	if (!JS_GetProperty(cx, obj, key, &val)){
		JS_ReportError(cx, "object has not property (%s)", key);
		return JS_FALSE;
	}

	if( !JS_ValueToObject(cx, val, objVal) ){
		JS_ReportError(cx, "object property (%s) is not an object", key);
		return JS_FALSE;
	}

	return JS_TRUE;
}

JSBool unparse::getObjPropertyAndConvertToString(JSObject *obj, const char *key, 
	JSString **strVal)
{
	jsval val;
	if (!JS_GetProperty(cx, obj, key, &val)){
		JS_ReportError(cx, "object has not property (%s)", key);
		return JS_FALSE;
	}

	JSString *s = JS_ValueToString(cx, val);
	if (!s){
		JS_ReportError(cx, "cannot convert value to string");
		return JS_FALSE;
	}
	*strVal = s;

	return JS_TRUE;
}

JSBool unparse::getArrayElementAndConvertToObj(JSObject *arrayObj, const uint32_t index, 
	JSObject **objVal)
{
	jsval node;
	if (!JS_GetElement(cx, arrayObj, index, &node)){
		JS_ReportError(cx, "Array does not have index %d", index);
		return JS_FALSE;
	}

	if( !JS_ValueToObject(cx, node, objVal) ){
		JS_ReportError(cx, "Array has not object as value @ index: %d", index);
		return JS_FALSE;
	}

	return JS_TRUE;
}

//////////////////////////////

JSBool unparse::unparse_expr(JSObject *exprVal, JSString **s, JSString *indent, int cprec, bool noIn)
{
	JSString *typeStr;
	if( !getObjPropertyAndConvertToString(exprVal, "type", &typeStr) )
		return JS_FALSE;

	const char *typeChars = JS_EncodeString(cx, typeStr);
	stringifyExprHandlerMap::Ptr ptr = stringifyExprHandlerMapInst.lookup(typeChars);

	if( !ptr.found() ){
		JS_ReportError(cx, "not suitable method found for %s expression type", typeChars);
		return JS_FALSE;
	}
	stringifyExprHandler exprhandlerfunc = ptr->value;

	if (! ((*this).*(exprhandlerfunc))(exprVal, s, indent, cprec, noIn) )
		return JS_FALSE;

	return JS_TRUE;
}

template<class ValueApplier>
JSBool unparse::unparse_values(JSObject *obj, Vector<JSString*> *children, ValueApplier applier, bool noIn)
{
	if ( !JS_IsArrayObject(cx, obj ) ) {
		JS_ReportError(cx, "object type is not program");
		return JS_FALSE;
	}

	uint32_t lengthp;
	if (!JS_GetArrayLength(cx, obj, &lengthp))
		return JS_FALSE;

	JSString *indent = cx->runtime()->emptyString;
	for(uint32_t i=0; i<lengthp; ++i) {
		jsval node;
		if (!JS_GetElement(cx, obj, i, &node)){
			JS_ReportError(cx, "array has not index: %d", i);
			return JS_FALSE;
		}

		JSObject *nodeObj;
		if( !JS_ValueToObject(cx, node, &nodeObj) ){
			JS_ReportError(cx, "array has not object as value @ index: %d", i);
			return JS_FALSE;
		}

		JSString *child;
		if (!applier.apply(this, nodeObj, &child, indent, srcStr(JSSRCNAME_FIVESPACES), noIn))
			return JS_FALSE;
		
		children->append(child);
	}

	return JS_TRUE;
}

JSBool unparse::unparse_sourceElement(JSObject *val, JSString **child, JSString *indent)
{
	JSString *typeStr;
	if( !getObjPropertyAndConvertToString(val, "type", &typeStr) )
		return JS_FALSE;

	const char *typeChars = JS_EncodeString(cx, typeStr);
	stringifyStmtHandlerMap::Ptr ptr = stringifyStmtHandlerMapInst.lookup(typeChars);

	if( !ptr.found() ){
		JS_ReportError(cx, "not suitable method found for %s statement type", typeChars);
		return JS_FALSE;
	}
	stringifyStmtHandler stmthandlerfunc = ptr->value;

	if (! ((*this).*(stmthandlerfunc))(val, child, indent) )
		return JS_FALSE;

	return JS_TRUE;
}

JSBool unparse::unParse_start(JSObject *obj, JSString **s)
{	
	JSString *objTypeStr;
	if( !getObjPropertyAndConvertToString(obj, "type", &objTypeStr) )
		return JS_FALSE;
	
	if ( !objTypeStr->equals("Program") ) {
		JS_ReportError(cx, "object type is not program");
		return JS_FALSE;
	}

	JSObject *bodyObj;
	if( !getObjPropertyAndConvertToObj(obj, "body", &bodyObj) )
		return JS_FALSE;

	Vector<JSString*> children(cx);
	sourceElementValueApplier seva;
	if ( !unparse_values(bodyObj, &children, seva, false ) )
		return JS_FALSE;

	*s = joinStringVector(&children, NULL, NULL, NULL );

	if( !(*s) ){
		fprintf(stderr, "empty string" );
		return JS_TRUE;
	}

	//str->dump();
	//fprintf(stderr, objType.toString()->getChars() );
	//js_DumpObject(obj);
	return JS_TRUE;
}