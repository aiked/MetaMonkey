#include "jsstaging.h"
#include "jsunparse.h"

#include <iostream>

using namespace js;


///////////////////////
// Stage

Stage::Stage(JSContext *x) : cx(x), inlinesInfo(x), execNodes(x){
	code = cx->runtime()->emptyString;
}

JSBool Stage::exec()
{
	char *source = JS_EncodeString(cx, code);
	std::cout<< "executing: " << source << '\n';
	jsval inlineRetVal;
	if (!JS_EvaluateScript(cx, cx->global(), source, strlen(source),
							"inlineEval.js", 1, &inlineRetVal))
		return JS_FALSE;
	return JS_TRUE;
}

JSBool Stage::clear()
{
	code->empty();
	inlinesInfo.clearAndFree();
	execNodes.clearAndFree();
	return JS_TRUE;
}

JSBool Stage::addInline(bool _isExpr, JSObject *expr, JSObject *_parent, JSObject *_node)
{
	inlinesInfo.append( InlineInfo( _isExpr, _parent, _node ) );
	if(!unparseInline(expr))
		return JS_FALSE;
	return JS_TRUE;
}

JSBool Stage::addInline(bool _isExpr, JSObject *expr, JSObject *_parent, const char *_key)
{
	inlinesInfo.append( InlineInfo( _isExpr, _parent, _key ) );
	if(!unparseInline(expr))
		return JS_FALSE;
	return JS_TRUE;
}

JSBool Stage::unparseInline(JSObject *expr)
{
	JSString *inlineExprStr;
	unparse up(cx);
	if (!up.unparse_expr(expr, &inlineExprStr, up.srcStr( unparse::JSSRCNAME_FIVESPACES ), 15, false))
		return JS_FALSE;
	JS_ASSERT(inlineExprStr);
	code = JS_JoinStrings(cx, 4, code, up.srcStr(unparse::JSSRCNAME_INLINE), 
						inlineExprStr, up.srcStr(unparse::JSSRCNAME_SPACERPSEMI));
	return JS_TRUE;
}

JSBool Stage::addExec(JSObject *node, JSObject *stmt)
{
	JSString *execStmtStr = cx->runtime()->emptyString;
	unparse up(cx);
	if(!up.substmt(stmt, &execStmtStr, cx->runtime()->emptyString, false))
		return JS_FALSE;
	JS_ASSERT(execStmtStr);
	code = JS_JoinStrings(cx, 2, code, execStmtStr );
	return JS_TRUE;
}


////////Stage////////




///////////////////////
// StagingProcess

StagingProcess *StagingProcess::stagingProcessSingleInst = NULL;

StagingProcess::StagingProcess(JSContext *_cx): cx(_cx), stage(_cx){}

void StagingProcess::createSingleton(JSContext *cx)
{
	JS_ASSERT(!stagingProcessSingleInst);
	stagingProcessSingleInst = cx->new_<StagingProcess>(cx);
}

void StagingProcess::destroySingleton()
{
	JS_ASSERT(stagingProcessSingleInst);
	js_delete(stagingProcessSingleInst);
	stagingProcessSingleInst = NULL;
}

StagingProcess * StagingProcess::getSingleton(){ return stagingProcessSingleInst; }



struct FindDeapestStage
{
	JSContext *cx;
	int depth;

	FindDeapestStage(JSContext *_cx): cx(_cx), depth(-1) {}

	JSBool singleObj(JSObject *node, JSObject *parentNode){
		JSObject *parentBody;
		//node->dump();
		if( parentNode ) {
			if(!AstObjMng::getMetaExecStmt(cx, parentNode, &parentBody))
				return JS_FALSE;

			if(parentBody)
				return JS_TRUE;
		}

		int currDepth = 0;
		JSObject *lastExecNode = NULL;
		JSObject *tmpNode;
		while(1) {
			if( !AstObjMng::getMetaExec(cx, node, &tmpNode) )
				return JS_FALSE;

			if(tmpNode) {
				++currDepth;
				lastExecNode = node;
				node = tmpNode;
			}else {
				JSObject *inlineBody;
				JSString *op;
				if( !AstObjMng::getUnaryExprStmt(cx, node, &op, &inlineBody) )
					return JS_FALSE;

				if( inlineBody && op->equals(".!") ) {
					depth = Max( depth, currDepth );
				}else if( currDepth > 0 ) {
					JS_ASSERT( lastExecNode );
					depth = Max( depth, currDepth - 1 );
				}
				break;
			}
		}

		return JS_TRUE;
	}
	JSBool arrayLoopStart(JSObject *node, JSObject *parentNode, uint32_t arrayLen){ return JS_TRUE; }
	JSBool arrayLoopIdx(JSObject *node, JSObject *parentNode, uint32_t idx, JSObject *elem){
		if(!singleObj(elem, parentNode))
			return JS_FALSE;

		return JS_TRUE;
	}
	JSBool arrayLoopEnd(JSObject *node, JSObject *parentNode){ return JS_TRUE; }
};

JSBool StagingProcess::getDeapestStage(JSObject *obj, int *depth )
{
	FindDeapestStage stageDepthFinder(cx);
	AstObjIterator objIterator(cx);
	if(!objIterator.iterateObject(obj, &stageDepthFinder))
		return JS_FALSE;
	*depth = stageDepthFinder.depth;
	return JS_TRUE;
}

struct ExtractStagingTags
{
	JSContext *cx;
	const uint32_t depth;
	Stage *stage;

	ExtractStagingTags(JSContext *_cx, Stage *_stage, const uint32_t _depth): cx(_cx), 
						depth(_depth), stage(_stage) {}

	JSBool singleObj(JSObject *node, JSObject *parentNode){ return JS_TRUE; }
	JSBool arrayLoopStart(JSObject *node, JSObject *parentNode, uint32_t arrayLen){ 
		return JS_TRUE; 
	}
	JSBool arrayLoopIdx(JSObject *node, JSObject *parentNode, uint32_t idx, JSObject *elem){
		JSObject *inlineBodyObj;
		bool isExpr;
		if( !AstObjMng::getInlineNode(cx, parentNode, elem, &inlineBodyObj, &isExpr, depth ) )
			return JS_FALSE;
		if(inlineBodyObj){
			stage->addInline(isExpr, inlineBodyObj, node, elem);
		}else {
			JSObject *execBodyObj;
			if( !AstObjMng::getExecNode(cx, parentNode, elem, &execBodyObj, &isExpr, depth ) )
				return JS_FALSE;
			if(execBodyObj){
				stage->addExec(elem, execBodyObj);
			}
		}
		return JS_TRUE;
	}
	JSBool arrayLoopEnd(JSObject *node, JSObject *parentNode){ 
		return JS_TRUE; 
	}
};

JSBool StagingProcess::collectStage(JSObject *obj, uint32_t depth)
{
	if(!stage.clear())
		return JS_FALSE;
	ExtractStagingTags stageDepthFinder(cx, &stage, depth);
	AstObjIterator objIterator(cx);
	if(!objIterator.iterateObject(obj, &stageDepthFinder))
		return JS_FALSE;
	return JS_TRUE;
}

////////MStagingProcess////////

