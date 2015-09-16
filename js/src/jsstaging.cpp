#include "jsprf.h"
#include "vm/Debugger.h"
#include "jsstaging.h"
#include "jsunparse.h"

#include <iostream>
#include <string>

using namespace js;
using namespace std;


///////////////////////
// Stage

Stage::Stage(JSContext *_cx) : 
			cx(_cx), inlineNodesInfo(_cx), execNodesInfo(_cx), depth(0), stagedDBInfo(NULL)
{
	code = cx->runtime()->emptyString;
}

JSBool Stage::execFinish(char *source, bool res)
{
	js_free(source);
	if(res){
		if (!cutExecs())
			return JS_FALSE;
	}
	return res;
}

JSBool Stage::exec()
{
	char *source = JS_EncodeString(cx, code);
	if(stagedDBInfo){
		bool hasDebug;
		if (!stagedDBInfo->hasDebugAtDepth(depth, &hasDebug))
			return execFinish(source, false);
		if(hasDebug) {
			if (!stagedDBInfo->debug(source, depth))
				return execFinish(source, false);
			return execFinish(source, true);
		}
		
	}
	jsval inlineRetVal;
	if (!JS_EvaluateScript(cx, cx->global(), source, strlen(source),
							"inlineEval.js", 1, &inlineRetVal))
		return execFinish(source, false);
	
	return execFinish(source, true);
}

JSBool Stage::init(JSObject *_ast, uint32_t _depth)
{
	depth = _depth;
	ast = _ast;
	code = cx->runtime()->emptyString;
	inlineNodesInfo.clearAndFree();
	execNodesInfo.clearAndFree();
	return JS_TRUE;
}

JSBool Stage::unparseAst(JSString **srcCode)
{
	unparse *up = unparse::getSingleton();
	if (!up->unParse_start(ast, srcCode))
		return JS_FALSE;
	return JS_TRUE;
}

JSBool Stage::cutExecs()
{
	while(!execNodesInfo.empty()) {
		NodeInfo execNodeInfo = execNodesInfo.popCopy();
		if(!MergeNodeToAst(cx, execNodeInfo))
			return JS_FALSE;
	}
	return JS_TRUE;
}

JSBool Stage::pushInline(NodeInfo nodeInfo, JSObject *expr)
{
	inlineNodesInfo.append( nodeInfo );
	JSString *inlineExprStr;
	unparse up(cx);
	if (!up.unparse_expr(expr, &inlineExprStr, up.srcStr( unparse::JSSRCNAME_FIVESPACES ), 15, false))
		return JS_FALSE;
	JS_ASSERT(inlineExprStr);
	code = JS_JoinStrings(cx, 4, code, up.srcStr(unparse::JSSRCNAME_INLINE), 
						inlineExprStr, up.srcStr(unparse::JSSRCNAME_SPACERPSEMI));
	return JS_TRUE;
}

JSBool Stage::pushExec(NodeInfo nodeInfo, JSObject *stmt)
{
	execNodesInfo.append( nodeInfo );
	JSString *execStmtStr = cx->runtime()->emptyString;
	unparse up(cx);
	if(!up.substmt(stmt, &execStmtStr, cx->runtime()->emptyString, false))
		return JS_FALSE;
	JS_ASSERT(execStmtStr);
	code = JS_JoinStrings(cx, 2, code, execStmtStr );
	return JS_TRUE;
}

NodeInfo Stage::dequeueInline()
{
	JS_ASSERT(!inlineNodesInfo.empty());
	NodeInfo *pinlineInfo = inlineNodesInfo.begin();
	NodeInfo inlineInfo = *pinlineInfo;
	inlineNodesInfo.erase(pinlineInfo);
	return inlineInfo;
}


////////Stage////////



JSBool js::MergeNodeToAst(JSContext *cx, NodeInfo nodeinfo, JSObject *ast)
{
	JSObject *arrayNodes = JS_NewArrayObject(cx, 0, NULL);
	uint32_t arrayNodesLen = 0;
	jsval astVal = OBJECT_TO_JSVAL(ast);
	if(nodeinfo.isArray) {
		/*
			in case of an array of nodes:
			[ node1, inlineNode, node3 ]

			Assuming that there are 2 nodes that we want to replace to the newNode:
			[ newNode1, newNode2 ]

			we replace the nodes with the following method:
			[ node1, inlineNode, node3 ].splice(
				1, //inlineNode index in array
				1, //delete that node,
				newNode1, //add the newNode1
				newNode2 // add the newNode1
			);

			as a result we get the new merged array:
			[ node1, newNode1, newNode2, node3 ]
		*/
		int nodeIdx;
		if(!JS_ArrayIndexOf(cx, nodeinfo.parent, 
					OBJECT_TO_JSVAL( nodeinfo.value.node ), &nodeIdx ))
			return JS_FALSE;

		if(nodeIdx==-1){
			JS_ReportError(cx, "MergeNodeToAst: cannot find node\n");
			return JS_FALSE;
		}

		JS::Value *spliceArgs;
		if(ast) {
			if( !AstObjMng::GetStmtsFromAstObj(cx, !nodeinfo.isExpr, astVal, 
												&arrayNodes, &arrayNodesLen) )
				return JS_FALSE;

			spliceArgs = cx->pod_malloc<JS::Value>(arrayNodesLen + 2);
			spliceArgs[0] = UINT_TO_JSVAL( nodeIdx );
			spliceArgs[1] = UINT_TO_JSVAL( 1 );
			for( uint32_t i=0; i<arrayNodesLen; ++i ){
				JS::Value elem;
				if (!JS_GetElement(cx, arrayNodes, i, &elem)){
					js_delete(spliceArgs);
					return JS_FALSE;
				}
				spliceArgs[ i + 2 ] = elem;
			}
		}else {
			spliceArgs = cx->pod_malloc<JS::Value>(2);
			spliceArgs[0] = UINT_TO_JSVAL( nodeIdx );
			spliceArgs[1] = UINT_TO_JSVAL( 1 );
		}	 

		JS::Value spliceRetVal;
		if (!JS_CallFunctionName(cx, nodeinfo.parent, "splice", arrayNodesLen+2, 
									spliceArgs, &spliceRetVal)){
			JS_ReportError(cx, "MergeNodeToAst: ast tree replacement fail\n");
			js_delete(spliceArgs);
			return JS_FALSE;
		}
		js_delete(spliceArgs);
	}else {
		if(ast) {
			if( !AstObjMng::GetStmtsFromAstObj(cx, !nodeinfo.isExpr, astVal, 
												&arrayNodes, &arrayNodesLen) )
				return JS_FALSE;

			if( arrayNodesLen==1 ) {
				jsval node;
				if (!JS_GetElement(cx, arrayNodes, 0, &node))
					return JS_FALSE;
			
				if (!JS_SetProperty(cx, nodeinfo.parent, nodeinfo.value.key, &node))
					return JS_FALSE;
			}else {
				JS_ReportError(cx, "MergeNodeToAst: found more than one nodes to replace\n");
				return JS_FALSE;
			}	
		}else {
			if(nodeinfo.isExpr) {
				if (!JS_SetProperty(cx, nodeinfo.parent, nodeinfo.value.key, &NullValue()))
					return JS_FALSE;
			}else {
				JSObject *emptyStmtNode = JS_NewObject(cx, NULL, NULL, NULL);
				if (!emptyStmtNode)
					return JS_FALSE;
				JSString *emptyStmtStr = JS_NewStringCopyZ(cx, "EmptyStatement");
				if (!JS_SetProperty(cx, emptyStmtNode, "type", &STRING_TO_JSVAL(emptyStmtStr)))
					return JS_FALSE;
				if (!JS_SetProperty(cx, emptyStmtNode, "loc", &NullValue()))
					return JS_FALSE;
				if (!JS_SetProperty(cx, nodeinfo.parent, nodeinfo.value.key, &OBJECT_TO_JSVAL(emptyStmtNode)))
					return JS_FALSE;
			}
			// if !isExpr nop, else null?
		}
	}
	return JS_TRUE;
}


///////////////////////
// StagingProcess

StagingProcess *StagingProcess::stagingProcessSingleInst = NULL;

StagingProcess::StagingProcess(JSContext *_cx, const char *_outputFilename, const char *dbInfoFileName): 
								cx(_cx), stage(_cx), outputFilename(_outputFilename), stgrep(NULL)
{
	if( dbInfoFileName ) {
		stagedDBInfo = StagedDBInfo::createFromFile(cx, dbInfoFileName);
		stage.attachDebugger(stagedDBInfo);
	}else {
		stagedDBInfo = NULL;
	}
}

void StagingProcess::createSingleton(JSContext *cx, const char *outputFilename, const char *dbInfoFileName)
{
	JS_ASSERT(!stagingProcessSingleInst);
	stagingProcessSingleInst = cx->new_<StagingProcess>(cx, outputFilename, dbInfoFileName);
}

void StagingProcess::destroySingleton()
{
	JS_ASSERT(stagingProcessSingleInst);
	if(stagingProcessSingleInst->stagedDBInfo){
		js_delete(stagingProcessSingleInst->stagedDBInfo);
		stagingProcessSingleInst->stagedDBInfo = NULL;
	}
	js_delete(stagingProcessSingleInst);
	stagingProcessSingleInst = NULL;
}

StagingProcess * StagingProcess::getSingleton(){ return stagingProcessSingleInst; }

template<class StagedNodeVisitor>
struct StagedNodeIterator
{
	JSContext *cx;
	uint32_t inlines, execs, quazis;
	StagedNodeVisitor *stagedNodeVisitor; 
	Vector<JSObject *> inlineNodes;
	Vector<JSObject *> execNodes;

	StagedNodeIterator(JSContext *_cx, StagedNodeVisitor *_stagedNodeVisitor): 
			cx(_cx), inlines(0), execs(0), quazis(0), inlineNodes(_cx), execNodes(_cx)
	{
		stagedNodeVisitor = _stagedNodeVisitor;
	}

	JSBool singleObjEnter(const char *propKey, JSObject *node, JSObject *parentNode){
		JSObject *body;
		if( !AstObjMng::getMetaQuaziStmt(cx, node, &body))
			return JS_FALSE;
		if(body){
			++quazis;
			return JS_TRUE;
		}
		
		if(quazis==0) {
			bool isExpr;
			JSObject *inlineNode;
			JSString *op;
			if( !AstObjMng::getUnaryExpr(cx, node, &op, &inlineNode) )
				return JS_FALSE;

			if(inlineNode && op->equals(".!")){
				JSObject *parentExpr;
				if(!AstObjMng::getExprStmt(cx, parentNode, &parentExpr))
					return JS_FALSE;
				if(node==parentExpr){
					return JS_TRUE;
				}
				isExpr = true;
			}else { 
				isExpr = false;	
				if(!AstObjMng::getUnaryExprStmt(cx, node, &op, &inlineNode) )
					return JS_FALSE;
			}

			if( inlineNode && op->equals(".!") ){
				++inlines;
				inlineNodes.append(node);
				stagedNodeVisitor->InlineNodeEnter( NodeInfo( isExpr, parentNode, propKey ), inlineNode, inlines+execs );
				return JS_TRUE;
			}
			
			JSObject *execNode;
			if( !AstObjMng::getMetaExecStmt(cx, node, &execNode) )
				return JS_FALSE;

			if(execNode) {
				JSObject *parentExpr;
				if(!AstObjMng::getExprStmt(cx, parentNode, &parentExpr))
					return JS_FALSE;
				if(node==parentExpr){
					return JS_TRUE;
				}
				isExpr = true;
			}else {
				isExpr = false;	
				if( !AstObjMng::getMetaExecExprStmt(cx, node, &execNode) )
					return JS_FALSE;
			}

			if( execNode ){
				if( inlines>0 ){
					JS_ReportError(cx, "found execute node inside an inline node");
					return JS_FALSE;
				}
				++execs;
				execNodes.append(node);
				stagedNodeVisitor->ExecNodeEnter( NodeInfo( isExpr, parentNode, propKey ), execNode, inlines+execs );
				return JS_TRUE;
			}
		}
		return JS_TRUE;
	}

	JSBool singleObjExit(const char *propKey, JSObject *node, JSObject *parentNode){
		JSObject *body;
		if( !AstObjMng::getMetaQuaziStmt(cx, node, &body))
			return JS_FALSE;
		if(body){
			--quazis;
			return JS_TRUE;
		}

		JSObject *lastNode;
		if(!inlineNodes.empty()) {
			lastNode = inlineNodes.back();
			if(node==lastNode) {
				inlineNodes.popBack();
				--inlines;
				return JS_TRUE;
			}
		}

		if(!execNodes.empty()) {
			lastNode = execNodes.back();
			if(node==lastNode) {
				execNodes.popBack();
				--execs;
				return JS_TRUE;
			}
		}

		return JS_TRUE;
	}
	JSBool arrayLoopStart(JSObject *node, JSObject *parentNode, uint32_t arrayLen){ return JS_TRUE; }
	JSBool arrayLoopIdxEnter(JSObject *node, JSObject *parentNode, uint32_t idx, JSObject *elem){
		JSObject *body;
		if( !AstObjMng::getMetaQuaziStmt(cx, elem, &body))
			return JS_FALSE;
		if(body){
			++quazis;
			return JS_TRUE;
		}
		
		if(quazis==0) {
			bool isExpr;
			JSObject *inlineNode;
			JSString *op;
			if( !AstObjMng::getUnaryExpr(cx, elem, &op, &inlineNode) )
				return JS_FALSE;

			if(inlineNode && op->equals(".!")){
				isExpr = true;
			}else { 
				isExpr = false;	
				if(!AstObjMng::getUnaryExprStmt(cx, elem, &op, &inlineNode) )
					return JS_FALSE;
			}

			if( inlineNode && op->equals(".!") ){
				++inlines;
				inlineNodes.append(elem);
				stagedNodeVisitor->InlineNodeEnter( NodeInfo( isExpr, node, elem ), inlineNode, inlines+execs );
				return JS_TRUE;
			}
			
			JSObject *execNode;
			if( !AstObjMng::getMetaExecStmt(cx, elem, &execNode) )
				return JS_FALSE;

			if(execNode) {
				isExpr = true;
			}else {
				isExpr = false;	
				if( !AstObjMng::getMetaExecExprStmt(cx, elem, &execNode) )
					return JS_FALSE;
			}

			if( execNode ){
				if( inlines>0 ){
					JS_ReportError(cx, "found execute node inside an inline node");
					return JS_FALSE;
				}
				++execs;
				execNodes.append(elem);
				stagedNodeVisitor->ExecNodeEnter( NodeInfo( isExpr, node, elem ), execNode, inlines+execs );
				return JS_TRUE;
			}
		}
		return JS_TRUE;
	}
	JSBool arrayLoopIdxExit(JSObject *node, JSObject *parentNode, uint32_t idx, JSObject *elem){
		if(!singleObjExit(NULL, elem, parentNode))
			return JS_FALSE;
		return JS_TRUE;
	}
	JSBool arrayLoopEnd(JSObject *node, JSObject *parentNode){ return JS_TRUE; }
};


struct StageDepthFinder
{
	JSContext *cx;
	uint32_t maxdepth;

	StageDepthFinder(JSContext *_cx): cx(_cx), maxdepth(0){}

	JSBool InlineNodeEnter(const NodeInfo &nodeInfo, JSObject *expr, uint32_t depth)
	{
		maxdepth = Max(maxdepth, depth);
		return JS_TRUE;
	}

	JSBool ExecNodeEnter(const NodeInfo &nodeInfo, JSObject *stmt, uint32_t depth)
	{
		maxdepth = Max(maxdepth, depth);
		return JS_TRUE;
	}
};

JSBool StagingProcess::getDeapestStage(JSObject *obj, uint32_t *depth )
{
	StageDepthFinder stageDepthFinder(cx);
	StagedNodeIterator<StageDepthFinder> stagednodesIterator(cx, &stageDepthFinder);
	AstObjIterator objIterator(cx);
	if(!objIterator.iterateObject(obj, &stagednodesIterator))
		return JS_FALSE;
	*depth = stageDepthFinder.maxdepth;
	return JS_TRUE;
}


struct ExtractStagingTags
{
	JSContext *cx;
	uint32_t targetDepth;
	Stage *stage;

	ExtractStagingTags(JSContext *_cx, Stage *_stage, uint32_t depth): 
						cx(_cx), stage(_stage), targetDepth(depth){}

	JSBool InlineNodeEnter(const NodeInfo &nodeInfo, JSObject *expr, uint32_t depth)
	{
		if(depth==targetDepth){
			stage->pushInline(nodeInfo, expr);
		}
		return JS_TRUE;
	}

	JSBool ExecNodeEnter(const NodeInfo &nodeInfo, JSObject *stmt, uint32_t depth)
	{
		if(depth==targetDepth){
			stage->pushExec(nodeInfo, stmt);
		}
		return JS_TRUE;
	}
};

JSBool StagingProcess::collectStage(JSObject *obj)
{
	ExtractStagingTags stageDepthFinder(cx, &stage, stage.getDepth());
	StagedNodeIterator<ExtractStagingTags> stagednodesIterator(cx, &stageDepthFinder);
	AstObjIterator objIterator(cx);
	return objIterator.iterateObject(obj, &stagednodesIterator);
}

JSBool StagingProcess::nextStage(JSObject *ast, uint32_t *depth, JSString **srcCode)
{
	*srcCode = nullptr;
	if(!getDeapestStage(ast, depth))
		return JS_FALSE;
	if(*depth!=0){

		if( !(stage.init(ast, *depth) && collectStage(ast)) )
			return JS_FALSE;

		*srcCode = stage.getSrcCode();
	}
	return JS_TRUE;
}

JSBool StagingProcess::executeInline(JSObject *inlnArg)
{
	NodeInfo inlineNodeInfo = stage.dequeueInline();
	if(!MergeNodeToAst(cx, inlineNodeInfo, inlnArg))
		return JS_FALSE;
	return JS_TRUE;
}

JSBool StagingProcess::staging(JSObject *obj, uint32_t depth)
{
	JSString *srcCode;
	return stage.init(obj, depth)
		&& collectStage(obj)
		&& reportExecutionStaging()
		&& stage.exec()
		&& stage.unparseAst(&srcCode)
		&& reportResultStaging(srcCode);
}

JSBool StagingProcess::reportExecutionStaging()
{	
	JSString *srcCode = stage.getSrcCode();
	if(stgrep){
		if(!stgrep->reportExec(srcCode))
			return JS_FALSE;
	}

	if(!outputFilename) 
		return JS_TRUE;

	char *filename = JS_sprintf_append(NULL, "%s_stage_%d.js", 
							outputFilename, (int) stage.getDepth());
	JS_ReportInfo(cx, "\tsaving execution source\n\tto \"%s\"\n", filename);
	if(!JS::AutoFile::OpenAndWriteAll(cx, filename, srcCode))
		return JS_FALSE;

	js_free(filename);

	filename = JS_sprintf_append(NULL, "%s_stage_%d_db.html", 
							outputFilename, (int) stage.getDepth());
	js_free(filename);

	return JS_TRUE;
}

JSBool StagingProcess::reportResultStaging(JSString *srcCodeStr)
{
	if(stgrep) {
		if(!stgrep->reportResult(srcCodeStr))
			return JS_FALSE;
	}

	if(!outputFilename) 
		return JS_TRUE;

	char *filename = JS_sprintf_append(NULL, "%s_stage_%d_result.js", 
							outputFilename, (int) stage.getDepth());
	JS_ReportInfo(cx, "\tsaving execution source\n\tto \"%s\"\n", filename);
	if(!JS::AutoFile::OpenAndWriteAll(cx, filename, srcCodeStr))
		return JS_FALSE;
	js_free(filename);
	return JS_TRUE;
}

void StagingProcess::setStagingReporter(StagingProcessReporter *stgrep) 
{
	this->stgrep = stgrep;
}

////////MStagingProcess////////


