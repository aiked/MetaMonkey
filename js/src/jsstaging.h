/*
metadev
*/

#pragma once

#ifndef jsstaging_h
#define jsstaging_h

#include "jsapi.h"
#include "jsastmng.h"
#include "jsstagedbinfo.h"

namespace js {

///////////////////////
// MetaStage

/*
There are 2 different types to acces a value from an object.

1. In case of Array:
	arrayVal = [
		val1,
		val2
	];

	isArray = true;
	value.node = val1;
	parent = arrayVal;

2. In case of Object:
	objVal = {
		key1: val1,
		key2: val2
	}
	isArray = false;
	value.key = key1;
	parent = objVal;
*/
	
struct NodeInfo{
	bool isArray;
	bool isExpr;
	
	typedef union value{
		JSObject *node;
		const char *key;
	}Value;
	Value value;

	JSObject *parent;

	NodeInfo(bool _isExpr, JSObject *_parent, JSObject *_node )
		: isArray(true), isExpr(_isExpr), parent(_parent) { value.node = _node; }

	NodeInfo(bool _isExpr, JSObject *_parent, const char *_key )
		: isArray(false), isExpr(_isExpr), parent(_parent) { value.key = _key; }
};

extern JSBool MergeNodeToAst(JSContext *cx, NodeInfo nodeinfo, JSObject *ast=NULL);

class Stage{
	JSContext *cx;
	JSObject *ast;
	JSString *code;
	uint32_t depth;
	Vector<NodeInfo> inlineNodesInfo;
	Vector<NodeInfo> execNodesInfo;
	StagedDBInfo *stagedDBInfo;

  public:
	Stage(JSContext *cx);

	JSBool pushInline(NodeInfo nodeInfo, JSObject *expr);
	JSBool pushExec(NodeInfo nodeInfo, JSObject *stmt);

	NodeInfo dequeueInline();

	JSBool exec();
	JSBool init(JSObject *ast, uint32_t depth);
	JSBool unparseAst(JSString **srcCode);

	void attachDebugger(StagedDBInfo *_stagedDBInfo){ stagedDBInfo = _stagedDBInfo; };
	StagedDBInfo *getDebugger(){ return stagedDBInfo; };

	uint32_t getDepth(){ return depth; }
	JSString *getSrcCode(){ return code; }
  private:
	JSBool execFinish(char *source, bool res);
	JSBool cutExecs();
};

class StagingProcess{
	template<class Client> friend struct MallocProvider;

	static StagingProcess *stagingProcessSingleInst;

	JSContext *cx;
	Stage stage;
	StagedDBInfo *stagedDBInfo;
	const char *outputFilename;

	StagingProcess(JSContext *cx, const char *outputFilename, const char *dbInfoFileName);

  public:
	static void createSingleton(JSContext *cx, const char *outputFileName, const char *dbInfoFileName = NULL);
	static void destroySingleton();
	static StagingProcess *getSingleton();

	JSBool nextStage(JSObject *ast, uint32_t *depth);
	JSBool executeInline(JSObject *inlnArg);
	Stage &getStage(){ return stage; }

  private:
	JSBool staging(JSObject *obj, uint32_t depth);
	JSBool getDeapestStage(JSObject *obj, uint32_t *depth);
	JSBool collectStage(JSObject *obj);
	JSBool reportExecutionStaging();
	JSBool reportResultStaging(JSString *srcCode);
};


////////MetaStage////////

}/* js */



#endif 
/* jsstaging_h */