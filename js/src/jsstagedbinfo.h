/*
metadev
*/

#pragma once

#ifndef jsstagedbinfo_h
#define jsstagedbinfo_h

#include "jsapi.h"

namespace js {

class StagedDBInfo{
  JSContext *cx;
  JSObject *dbInfo;

  JSBool getDebugAtDepth(uint32_t depth, JSObject **debug);

  public:
	  static StagedDBInfo *createFromFile(JSContext *cx, const char *filename);
	  static StagedDBInfo *createFromString(JSContext *cx, const jschar *src);
	  StagedDBInfo(JSContext *_cx, JSObject *_dbInfo);
	  
	  JSBool hasDebugAtDepth(uint32_t depth, bool *hasDebug);
	  JSBool debug(const char *src, uint32_t depth);
};

}/* js */

#endif /* jsstagedbinfo_h */