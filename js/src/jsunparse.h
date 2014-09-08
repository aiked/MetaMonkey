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
  private:
	JSContext *cx;
	JSString *indentChar;
	JSString *fourHash;

	JSObject *jsonGlobalObj;

	typedef JSBool (unparse::*stringifyStmtHandler)
		(JSObject *val, JSString **child, JSString *indent);
	typedef HashMap<const char *, stringifyStmtHandler, ConstCharStarHasher> stringifyStmtHandlerMap;

	typedef JSBool (unparse::*stringifyExprHandler)
		(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	typedef HashMap<const char *, stringifyExprHandler, ConstCharStarHasher> stringifyExprHandlerMap;

	typedef HashMap<const char *, size_t, ConstCharStarHasher> stringToIntMap;

	stringToIntMap precedence;
	stringifyStmtHandlerMap stringifyStmtHandlerMapInst;
	stringifyExprHandlerMap stringifyExprHandlerMapInst;

	Vector<JSString*> inlineEvaluateCode;

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
		JSSRCNAME_INLINECALL,
		JSSRCNAME_ESCAPECALL,
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

		JSSRCNAME_END
	};

	Vector<JSString*, JSSRCNAME_END> standarJsSrcNames;

	/////////////////////// 
	// expression
	JSBool expr_array(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_obj(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_graph(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_graphIndx(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_let(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_gen(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_comprehen(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_yield(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_sequence(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_cond(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_indent(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_literal(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_call(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_new(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_this(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_member(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);	
	JSBool expr_metaQuazi(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_unary(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_logic(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_assign(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_func(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	JSBool expr_objpattern(JSObject *val, JSString **child, JSString *indent, int cprec, bool noIn);
	///////////////////////

	/////////////////////// 
	// statement
	JSBool stmt_block(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_variableDeclaration(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_empty(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_expression(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_let(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_if(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_while(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_for(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_forin(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_dowhile(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_continue(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_break(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_return(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_with(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_labeled(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_switch(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_throw(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_try(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_debugger(JSObject *val, JSString **child, JSString *indent);
	JSBool stmt_functiondeclaration(JSObject *val, JSString **child, JSString *indent);
	///////////////////////

	///////////////////////
	// inline evaluator

	JSBool inlineEvalAppendCode(JSString *code);
	JSBool inlineEvalExecInline(JSString *code, jsval *inlineRetVal);

	public:
	///////////////////////
	// object stringify
	JSBool stringifyObject(JSObject *obj, JSString **s);
	JSBool stringifyObjectProperty(JSObject *obj, Shape &shape, JSString **propKey, JSString **propVal);
	JSBool stringifyObjectValue(const Value &v, JSString **s);

	private:


	///////////////////////
	// helpers

	JSString* prefixSuffixConcatString(JSString *sep, Vector<JSString*> *strs, 
		JSString *str, size_t index);

	JSBool declarators(JSObject *decls, JSString **s, JSString *indent, bool noIn);
	JSBool wrapExpr(JSString **s, int cprec, int xprec);
	JSBool forHead(JSObject *val, JSString **s, JSString *indent);
	JSBool comprehension(JSObject *val, JSString **s, JSString *indent);
	JSBool substmt(JSObject *obj, JSString **s, JSString *indent, bool more);
	JSBool args(JSObject *values, JSString **s, JSString *indent);
	JSBool params(JSObject *values, JSString **s, JSString *indent);
	JSBool unexpected(JSObject *values, JSString **s);
	JSBool functionDeclaration(JSString *funcInitStr, JSString **s, 
								jsval id, JSObject *val, JSString *indent);

	JSBool isBadIdentifier(JSObject *val, JSBool *isBadÙ·ÎÔ);

	//JSString *unparse::trimRight(con);
	JSString *unparse::joinString(size_t num, ...);
	JSString *unparse::joinStringVector(Vector<JSString*> *strs, 
		JSString* sep, JSString* prf, JSString* suf, bool reverse = false);

	JSBool unparse::getObjPropertyAndConvertToString(JSObject *obj, 
		const char *key, JSString **strVal);
	JSBool unparse::getArrayElementAndConvertToObj(JSObject *arrayObj, 
		const uint32_t index, JSObject **objVal);

	inline size_t getPrecedence(char *key){
		stringToIntMap::Ptr ptr = precedence.lookup(key);
		return ptr.found() ? ptr->value: 0;
	}

	inline size_t getPrecedence(JSString *key){
		char *chars = JS_EncodeString(cx, key);
		return getPrecedence(chars);
	}

	inline JSString * srcStr(JSSRCNAME name){
		JS_ASSERT( name>JSSRCNAME_START && NAME<JSSRCNAME_END );
		return standarJsSrcNames[name];
	}

	struct sourceElementValueApplier
	{
		JSBool apply(unparse *uprs, JSObject *nodeObj, 
			JSString **child, JSString *indent, JSString *indentChar, bool noIn) 
		{
			if (!uprs->unparse_sourceElement(nodeObj, child, indent))
				return JS_FALSE;

			return JS_TRUE;
		}
	};

	struct argsValueApplier
	{
		JSBool apply(unparse *uprs, JSObject *nodeObj, 
			JSString **child, JSString *indent, JSString *indentChar, bool noIn) 
		{
			if (!uprs->unparse_expr(nodeObj, child, indent, 2, false))
				return JS_FALSE;

			return JS_TRUE;
		}
	};

	struct paramsValueApplier
	{
		JSString *indentArg;
		paramsValueApplier(JSString * ia) :indentArg(ia) {}
		JSBool apply(unparse *uprs, JSObject *nodeObj, 
			JSString **child, JSString *indent, JSString *indentChar, bool noIn) 
		{
			if (!uprs->unparse_expr(nodeObj, child, indentArg, 18, false))
				return JS_FALSE;

			return JS_TRUE;
		}
	};

	struct declValueApplier
	{
		JSBool apply(unparse *uprs, JSObject *nodeObj, 
			JSString **child, JSString *indent, JSString *indentChar, bool noIn) 
		{
			JSContext *cx = uprs->cx;
			JSString *typeStr;
			if( !uprs->getObjPropertyAndConvertToString(nodeObj, "type", &typeStr) )
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

				*child = uprs->joinString(5, pattStr, uprs->srcStr(JSSRCNAME_SPACE), 
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
		JSBool apply(unparse *uprs, JSObject *nodeObj, 
			JSString **child, JSString *indent, JSString *indentChar, bool noIn) 
		{
			JSString *stmtIndent = uprs->joinString(2, indent, indentChar);
			if (!uprs->unparse_sourceElement(nodeObj, child, stmtIndent))
				return JS_FALSE;
			return JS_TRUE;
		}
	};

  public:
	unparse(JSContext *x);

	JSBool unparse_expr(JSObject *exprVal, JSString **s, JSString *indent, int cprec, bool noIn);
	template<class ValueApplier>
	JSBool unparse_values(JSObject *obj, Vector<JSString*> *children, ValueApplier applier, bool noIn);
	JSBool unparse_sourceElement(JSObject *val, JSString **child, JSString *indent);
	JSBool unParse_start(JSObject *obj, JSString **s);
};

} /* js */

#endif /* jsunparse_h */