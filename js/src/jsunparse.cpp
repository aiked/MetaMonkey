/*
metadev
*/

#include "jsunparse.h"
#include <cstdarg>

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
		jsval node;

		if (!JS_GetElement(cx, arrayObj, i, &node)){
			JS_ReportError(cx, "expr_array: Array does not have index %d", i);
			return JS_FALSE;
		}

		JSObject *nodeObj;
		if( !JS_ValueToObject(cx, node, &nodeObj) ){
			JS_ReportError(cx, "expr_array: array has not object as value @ index: %d", i);
		}
		else{
			children.append(srcStr(JSSRCNAME_SPACE));
			
			JSString *nodeStr;
			if( !unparse_expr(nodeObj, &nodeStr, indent, 2, false) ){
				return JS_FALSE;
			}
			children.append(nodeStr);
		}

		if(i!=arrayLen-1 || !JS_GetElement(cx, arrayObj, i, &node) ){
			children.append(srcStr(JSSRCNAME_COMMA));
		}
	}
	children.append(srcStr(JSSRCNAME_RB));
	
	*child = joinStringVector(&children, NULL, NULL, NULL);

	return JS_TRUE;
}

JSBool unparse::expr_obj(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	const char *s = "expr_obj";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;
}

JSBool unparse::expr_graph(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	const char *s = "expr_graph";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;
}

JSBool unparse::expr_graphIndx(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	const char *s = "expr_graphIndx";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;
}

JSBool unparse::expr_let(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	const char *s = "expr_let";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;
}

JSBool unparse::expr_gen(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	const char *s = "expr_gen";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;
}

JSBool unparse::expr_comprehen(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	const char *s = "expr_comprehen";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;
}

JSBool unparse::expr_yield(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	const char *s = "expr_yield";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;
}

JSBool unparse::expr_sequence(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	const char *s = "expr_sequence";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;
}

JSBool unparse::expr_cond(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	const char *s = "expr_cond";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

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

JSBool unparse::expr_call(JSObject *val, JSString **child, 
	JSString *indent, int cprec, bool noIn)
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

JSBool unparse::expr_new(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	const char *s = "expr_new";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;
}

JSBool unparse::expr_this(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	const char *s = "expr_this";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;
}

JSBool unparse::expr_member(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	const char *s = "expr_member";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;
}

JSBool unparse::expr_unary(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	const char *s = "expr_unary";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;
}

JSBool unparse::expr_logic(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{

	JSString *opStr;
	if( !getObjPropertyAndConvertToString(val, "operator", &opStr) )
		return JS_FALSE;

	size_t prec = getPrecedence(opStr);
	if(prec==0){
		const char * chars = (const char *) opStr->getChars(cx);
		JS_ReportError(cx, "unsupposed precedence operator (%s)", chars);
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

JSBool unparse::expr_assign(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
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

JSBool unparse::expr_func(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	const char *s = "expr_func";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;
}

JSBool unparse::expr_objpattern(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn)
{
	const char *s = "expr_objpattern";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

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
	const char *s = "stmt_empty";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;	
}

JSBool unparse::stmt_expression(JSObject *val, JSString **child, JSString *indent){
	JSObject *exprObj;
	if( !getObjPropertyAndConvertToObj(val, "expression", &exprObj) )
		return JS_FALSE;

	JSString *exprStr;
	if (!unparse_expr(exprObj, &exprStr, indent, 0, false))
		return JS_FALSE;
    /*   
	if (s.match(/^(?:function |var |{)/))
    s = "(" + s + ")"; 
	*/
	*child = joinString(3, indent, exprStr, srcStr(JSSRCNAME_SEMINL));

	return JS_TRUE;	
}

JSBool unparse::stmt_let(JSObject *val, JSString **child, JSString *indent){
	const char *s = "stmt_let";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

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

		JSString *elseStr = JS_NewStringCopyZ(cx, "else");
		children.append(elseStr);
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
	const char *s = "stmt_forin";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;	
}

JSBool unparse::stmt_dowhile(JSObject *val, JSString **child, JSString *indent){
	const char *s = "stmt_dowhile";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;	
}

JSBool unparse::stmt_continue(JSObject *val, JSString **child, JSString *indent){
	const char *s = "stmt_continue";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;	
}

JSBool unparse::stmt_break(JSObject *val, JSString **child, JSString *indent){
	const char *s = "stmt_break";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

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
	const char *s = "stmt_with";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;	
}

JSBool unparse::stmt_labeled(JSObject *val, JSString **child, JSString *indent){
	const char *s = "stmt_labeled";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;	
}

JSBool unparse::stmt_switch(JSObject *val, JSString **child, JSString *indent){
	const char *s = "stmt_switch";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;	
}

JSBool unparse::stmt_throw(JSObject *val, JSString **child, JSString *indent){
	const char *s = "stmt_throw";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;	
}

JSBool unparse::stmt_try(JSObject *val, JSString **child, JSString *indent){
	const char *s = "stmt_try";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

	return JS_TRUE;	
}

JSBool unparse::stmt_debugger(JSObject *val, JSString **child, JSString *indent){
	const char *s = "stmt_debugger";
	*child = JS_NewStringCopyN(cx, s, strlen(s));

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

	*child = joinString(4, indent, funcDeclStr, 
		srcStr( exprPropVal.isNullOrUndefined() ? JSSRCNAME_SEMINL : JSSRCNAME_NL), 
		srcStr(JSSRCNAME_LP));

	return JS_TRUE;	
}

/////////////////////

unparse::unparse(JSContext *x) : precedence(x), stringifyExprHandlerMapInst(x), standarJsSrcNames(x), 
	stringifyStmtHandlerMapInst(x), cx(x)
{
	indentChar = JS_NewStringCopyZ(cx, "    ");
	fourHash = JS_NewStringCopyZ(cx, "####");

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
		"do", 
		"while (", 
		"(", ")", 
		"{", "}",
		"[", "]",
		";", 
		"\n", 
		";\n",
		"switch",
		"case", 
		"default", 
		":",
		"\"",
		"if (",
		"return",
		"function",
		"=",
		",",
		", ",
		"for ("
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
			*s = JS_NewDependentString(cx, body, indent->length(), body->length() - 1);
			*s = joinString(2, *s, srcStr(JSSRCNAME_SPACE)); 
		}
		else{
			*s = JS_NewDependentString(cx, body, indent->length(), body->length());
		}
		*s = joinString(2, srcStr(JSSRCNAME_SPACE), *s); 

	}
	else{
		indent = joinString(2, indent, indentChar);
		if (!unparse_sourceElement(obj, &body, indent))
			return JS_FALSE;

		*s = more ? joinString(3, srcStr(JSSRCNAME_NL), *s, indent) :
					joinString(3, srcStr(JSSRCNAME_NL), *s);

	}

	return JS_TRUE;
}

JSBool unparse::args(JSObject *values, JSString **s, JSString *indent)
{
	Vector<JSString*> children(cx);

	argsValueApplier ava;
	if ( !unparse_values(values, &children, ava, false ) )
		return JS_FALSE;

	*s = joinStringVector(&children, srcStr(JSSRCNAME_COMMASPACE), 
		srcStr(JSSRCNAME_LP), srcStr(JSSRCNAME_RP));

	return JS_TRUE;
}

JSBool unparse::params(JSObject *values, JSString **s, JSString *indent)
{
	Vector<JSString*> children(cx);

	paramsValueApplier ava(fourHash);
	if ( !unparse_values(values, &children, ava, false) )
		return JS_FALSE;

	*s = joinStringVector(&children, srcStr(JSSRCNAME_COMMASPACE),
		srcStr(JSSRCNAME_LP), srcStr(JSSRCNAME_RP));

	return JS_TRUE;
}

JSBool unparse::functionDeclaration(JSString *funcInitStr, JSString **s, 
		jsval id, JSObject *val, JSString *indent)
{
	bool isIdNull = id.isNullOrUndefined();
	JSString *funcNameStr = NULL;
	if(!isIdNull){
		JSObject *idObj;
		if( !JS_ValueToObject(cx, id, &idObj) ){
			JS_ReportError(cx, "functionDeclaration id is not an object");
			return JS_FALSE;
		}

		if( !unparse_expr(idObj, &funcNameStr, fourHash, 18, false) ){
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
		if (!applier.apply(this, nodeObj, &child, indent, indentChar, noIn))
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

JSBool unparse::unParse_start(JSObject *obj)
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

	JSString *str = joinStringVector(&children, NULL, NULL, NULL );

	if( !str ){
		fprintf(stderr, "empty string" );
		return JS_TRUE;
	}

	fprintf(stderr, "string: " );
	str->dumpChars(str->getChars(cx), str->length());

	//str->dump();
	//fprintf(stderr, objType.toString()->getChars() );
	//js_DumpObject(obj);
	return JS_TRUE;
}