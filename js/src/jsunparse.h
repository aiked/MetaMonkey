/*
metadev
*/

#pragma once

#ifndef jsunparse_h
#define jsunparse_h

#include "jsapi.h"
#include "frontend/Parser.h"

namespace js {

struct ConstCharStarHasher
{
	typedef const char * Lookup;
	static HashNumber hash(Lookup d) {
		int h = 0;
		while (*d)
			h = h << 1 ^ *d++;
		return h;
	}
	static bool match(Lookup lhs, Lookup rhs) {
		return strcmp(lhs, rhs)==0;
	}
};

class unparse{
  public:
	JSContext *cx;
	enum JSSRCNAME{
		JSSRCNAME_START = -1,

		JSSRCNAME_SPACE = 0,
		JSSRCNAME_FIVESPACES,
		JSSRCNAME_DO,
		JSSRCNAME_WHILESPACELP,
		JSSRCNAME_LP, JSSRCNAME_RP,
		JSSRCNAME_LC, JSSRCNAME_RC,
		JSSRCNAME_LB, JSSRCNAME_RB,
		JSSRCNAME_SEMI,
		JSSRCNAME_SPACERPSEMI,
		JSSRCNAME_QUESTION,
		JSSRCNAME_NL,
		JSSRCNAME_SEMINL,
		JSSRCNAME_SWITCH,
		JSSRCNAME_CASE,
		JSSRCNAME_DEFAULT,
		JSSRCNAME_COLON,
		JSSRCNAME_COLONSPACE,
		JSSRCNAME_HASH,
		JSSRCNAME_HASHES,
		JSSRCNAME_QM,
		JSSRCNAME_QMSINGLE,
		JSSRCNAME_IFSPACELP,
		JSSRCNAME_ELSE,
		JSSRCNAME_RETURN,
		JSSRCNAME_FUNCTION,
		JSSRCNAME_ASSIGN,
		JSSRCNAME_DOT,
		JSSRCNAME_COMMA,
		JSSRCNAME_COMMASPACE,
		JSSRCNAME_FOR,
		JSSRCNAME_FORSPACELP,
		JSSRCNAME_EACH,
		JSSRCNAME_IN,
		JSSRCNAME_YIELD,
		JSSRCNAME_NEW,
		JSSRCNAME_CONTINUE,
		JSSRCNAME_BREAK,
		JSSRCNAME_THROWSPACE,
		JSSRCNAME_TRY,
		JSSRCNAME_CATCH,
		JSSRCNAME_FINALLY,
		JSSRCNAME_WITHSPACELP,
		JSSRCNAME_VARSPACELP,
		JSSRCNAME_THIS,
		JSSRCNAME_DEBUGGERSEMI,
		JSSRCNAME_INLINE,
		JSSRCNAME_INLINECALL,
		JSSRCNAME_EXEC,
		JSSRCNAME_ESCAPECALL,
		JSSRCNAME_ESCAPEJSVALUECALL,
		JSSRCNAME_PROGRAM,
		JSSRCNAME_SPACEATSPACE,
		JSSRCNAME_NULL,
		JSSRCNAME_UNDEFINED,
		JSSRCNAME_TRUE,
		JSSRCNAME_FALSE,
		JSSRCNAME_INVALID,
		JSSRCNAME_ZERODIVZERO,
		JSSRCNAME_MAXNUM,
		JSSRCNAME_MINNUM,
		JSSRCNAME_INDEX,
		JSSRCNAME_EXPR,

		JSSRCNAME_END
	};
	Vector<JSString*, JSSRCNAME_END> standarJsSrcNames;

	inline JSString * srcStr(JSSRCNAME name){
		JS_ASSERT( name>JSSRCNAME_START && name<JSSRCNAME_END );
		return standarJsSrcNames[name];
	}

  private:
	static unparse *unparseSingleInst;

	JSString *indentChar;
	JSString *fourHash;
	JSObject *jsonGlobalObj;
	bool ignorecprec;

	typedef JSBool (unparse::*stringifyStmtHandler)
		(const JSObject *val, JSString **child, JSString *indent);
	typedef HashMap<const char *, stringifyStmtHandler, ConstCharStarHasher> stringifyStmtHandlerMap;

	typedef JSBool (unparse::*stringifyExprHandler)
		(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	typedef HashMap<const char *, stringifyExprHandler, ConstCharStarHasher> stringifyExprHandlerMap;

	typedef HashMap<const char *, size_t, ConstCharStarHasher> stringToIntMap;

	stringToIntMap precedence;
	stringifyStmtHandlerMap stringifyStmtHandlerMapInst;
	stringifyExprHandlerMap stringifyExprHandlerMapInst;

	Vector<JSString*> inlineEvaluateCode;

	/////////////////////// 
	// expression
	JSBool expr_array(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_obj(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_graph(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_graphIndx(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_let(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_gen(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_comprehen(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_yield(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_sequence(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_cond(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_indent(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_literal(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_call(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_new(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_this(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_member(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);	
	JSBool expr_metaQuazi(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_metaExec(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_unary(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_logic(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_assign(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_func(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_objpattern(const JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	///////////////////////

	/////////////////////// 
	// statement
	JSBool stmt_block(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_variableDeclaration(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_empty(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_expression(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_let(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_if(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_while(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_for(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_forin(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_dowhile(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_continue(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_break(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_return(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_with(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_labeled(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_switch(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_throw(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_try(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_debugger(const JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_functiondeclaration(const JSObject *val, JSString **child, JSString *indent);

	///////////////////////

	///////////////////////
	// inline evaluator

	public:
	///////////////////////
	// object stringify
	JSBool stringifyObject(const JSObject *obj, JSString **s);
	JSBool stringifyObjectProperty(const JSObject *obj, Shape &shape, JSString **propKey, JSString **propVal);
	JSBool stringifyObjectValue(const Value &v, JSString **s);
	
	private:

	///////////////////////
	// helpers

	JSBool declarators(const JSObject *decls, JSString **s, JSString *indent, bool noIn);
	JSBool wrapExpr(JSString **s, int cprec, int xprec);
	JSBool forHead(const JSObject *val, JSString **s, JSString *indent);
	JSBool comprehension(const JSObject *val, JSString **s, JSString *indent);
	JSBool args(const JSObject *values, JSString **s, JSString *indent);
	JSBool params(const JSObject *values, JSString **s, JSString *indent);
	JSBool unexpected(const JSObject *values, JSString **s);
	JSBool functionDeclaration(const JSString *funcInitStr, JSString **s, 
								jsval id, const JSObject *val, JSString *indent);

	JSBool isBadIdentifier(const JSObject *val, JSBool *isBad);
	JSBool objectContainEscapeExpr(const JSString *typeExprStr, const JSObject *exprObj, bool *retval, const JSObject **expr);
	JSBool objectContainEscape(const JSObject *obj, bool *retval, bool *fromStmt, const JSObject **retObj);
	JSBool objectContainEscapejsvalue(const JSObject *obj, bool *hasNodeEscapejsval, JSObject **escapeArgObj);

	//JSString *unparse::trimRight(con);
	inline size_t getPrecedence(const char *key){
		stringToIntMap::Ptr ptr = precedence.lookup(key);
		return ptr.found() ? ptr->value: 0;
	}

	inline size_t getPrecedence(const JSString *key){
		char *chars = JS_EncodeString(cx, const_cast<JSString*>(key) );
		return getPrecedence(chars);
	}
	
	struct sourceElementValueApplier
	{
		JSBool apply(unparse *uprs, const JSObject *nodeObj, 
			JSString **child, JSString *indent, JSString *indentChar, bool noIn) 
		{
			return uprs->unparse_sourceElement(nodeObj, child, indent);
		}
	};

	struct argsValueApplier
	{
		JSBool apply(unparse *uprs, const JSObject *nodeObj, 
			JSString **child, JSString *indent, JSString *indentChar, bool noIn) 
		{
			return uprs->unparse_expr(nodeObj, child, indent, 2, false);
		}
	};

	struct paramsValueApplier
	{
		JSString *indentArg;
		paramsValueApplier(JSString * ia) :indentArg(ia) {}
		JSBool apply(unparse *uprs, const JSObject *nodeObj, 
			JSString **child, JSString *indent, JSString *indentChar, bool noIn) 
		{
			return uprs->unparse_expr(nodeObj, child, indentArg, 0, false);
		}
	};

	struct declValueApplier
	{
		JSBool apply(unparse *uprs, const JSObject *nodeObj, 
			JSString **child, JSString *indent, JSString *indentChar, bool noIn) 
		{
			JSContext *cx = uprs->cx;
			JSString *typeStr;
			if( !JS_GetPropertyToString(cx, nodeObj, "type", &typeStr) )
				return JS_FALSE;

			if(!typeStr->equals("VariableDeclarator")){
				const char *typeChar = (const char *) typeStr->getChars(cx);
				JS_ReportError(uprs->cx, "Unexpected parse node type: %s", typeChar);
				return JS_FALSE;
			}

			JSObject *idObj;
			if( !JS_GetPropertyToObj(cx, nodeObj, "id", &idObj) )
				return JS_FALSE;

			JSString *pattStr;
			if( !uprs->unparse_expr(idObj, &pattStr, uprs->fourHash, 3, false) )
				return JS_FALSE;

			JSObject *initObj;
			if( !JS_GetPropertyToObj(cx, nodeObj, "init", &initObj) )
				return JS_FALSE;

			if( initObj ){
				JSString *rvalStr;
				if( !uprs->unparse_expr(initObj, &rvalStr, indent, 2, noIn) )
					return JS_FALSE;

				*child = JS_JoinStrings(cx, 5, pattStr, uprs->srcStr(JSSRCNAME_SPACE), 
					uprs->srcStr(JSSRCNAME_ASSIGN),	uprs->srcStr(JSSRCNAME_SPACE), rvalStr);			
			}
			else{
				*child = pattStr;
			}
			return *child!=NULL;

		}
	};

	struct blockStmtValueApplier
	{
		JSBool apply(unparse *uprs, const JSObject *nodeObj, 
			JSString **child, JSString *indent, JSString *indentChar, bool noIn) 
		{
			JSString *stmtIndent = JS_JoinStrings(uprs->cx, 2, indent, indentChar);
			if (!uprs->unparse_sourceElement(nodeObj, child, stmtIndent))
				return JS_FALSE;
			return JS_TRUE;
		}
	};

  public:
	// constructor should be private but not visible from jscntxt.h
	unparse(JSContext *x);
	~unparse();

	static void createSingleton(JSContext *x);
	static void destroySingleton(JSContext *x);
	static unparse *getSingleton();

	JSBool substmt(const JSObject *obj, JSString **s, JSString *indent, bool more);
	JSBool unparse_expr(const JSObject *exprVal, JSString **s, JSString *indent, int cprec, bool noIn);
	template<class ValueApplier>
	JSBool unparse_values(const JSObject *obj, Vector<JSString*> *children, ValueApplier applier, bool noIn);
	JSBool unparse_sourceElement(const JSObject *val, JSString **child, JSString *indent);
	JSBool unParse_start(const JSObject *obj, JSString **s);	 
}; /* class unparse */

} /* js */

#endif /* jsunparse_h */