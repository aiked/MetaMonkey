/*
metadev
*/

#pragma once

#ifndef jsstaging_h
#define jsstaging_h

#include "jsapi.h"
#include "jsastmng.h"


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
struct InlineInfo{
	bool isArray;
	bool isExpr;
	
	typedef union value{
		JSObject *node;
		const char *key;
	}Value;
	Value value;

	JSObject *parent;

	InlineInfo(bool _isExpr, JSObject *_parent, JSObject *_node )
		: isArray(true), isExpr(_isExpr), parent(_parent) { value.node = _node; }

	InlineInfo(bool _isExpr, JSObject *_parent, const char *_key )
		: isArray(true), isExpr(_isExpr), parent(_parent) { value.key = _key; }
};

class Stage{
	JSContext *cx;
	JSString *code;
	Vector<InlineInfo> inlinesInfo;
	Vector<JSObject*> execNodes;

  public:
	Stage(JSContext *cx);

	JSBool addInline(bool _isExpr, JSObject *expr, JSObject *_parent, JSObject *_node);
	JSBool addInline(bool _isExpr, JSObject *expr, JSObject *_parent, const char *_key);
	JSBool addExec(JSObject *node, JSObject *stmt);

	JSBool exec();
	JSBool clear();
  private:
	JSBool unparseInline(JSObject *expr);
};

class StagingProcess{
	template<class Client> friend struct MallocProvider;

	static StagingProcess *stagingProcessSingleInst;

	JSContext *cx;
	Stage stage;
	StagingProcess(JSContext *x);

  public:
	static void createSingleton(JSContext *cx);
	static void destroySingleton();
	static StagingProcess *getSingleton();

	JSBool getDeapestStage(JSObject *obj, int *depth);
	JSBool collectStage(JSObject *obj, uint32_t depth);
	Stage &getStage(){ return stage; };
};


////////MetaStage////////

}/* js */

#endif 
/* jsstaging_h */