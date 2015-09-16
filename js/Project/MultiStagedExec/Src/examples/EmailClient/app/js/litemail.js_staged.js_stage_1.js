 {
    var XML_PARSER_PATH = "Src\\examples\\EmailClient\\app\\js\\lib\\xparse.js";
    var BASIC_LAYOUT_XRC_PATH = "Src\\examples\\EmailClient\\fomrbuilder\\basicLayout.xrc";
    var LEFT_MENU_XRC_PATH = "Src\\examples\\EmailClient\\fomrbuilder\\leftMenu.xrc";
    var EMAIL_LIST_XRC_PATH = "Src\\examples\\EmailClient\\fomrbuilder\\emailList.xrc";
    var EMAIL_LIST_ITEM_XRC_PATH = "Src\\examples\\EmailClient\\fomrbuilder\\emailListItem.xrc";
    var COMPOSE_EMAIL_XRC_PATH = "Src\\examples\\EmailClient\\fomrbuilder\\composeEmail.xrc";
    var HEADER_XRC_PATH = "Src\\examples\\EmailClient\\fomrbuilder\\header.xrc";
    var UNDERSCORE_PATH = "Src\\examples\\EmailClient\\app\\js\\lib\\underscore.js";
    load(UNDERSCORE_PATH);
    var XrcConv = {};
    XrcConv.xrcToHtml = (function () {
    function WXFormatException(reason) {
    print(reason);
    this.reason = reason;
    }

    ;
    var WX_GrammarCheckCond = function (cond, msg) {
    if (!cond) {
    throw new WXFormatException(msg || "");
    }
}
;
    var WX_GrammarCheck = function () {
    var targetObj = arguments[0];
for (var i = arguments.length - 1; i !== 0; --i) {
    if (!_.has(targetObj, arguments[i])) {
    throw new WXFormatException;
    }
    }
}
;
    var ApplyToElems = function (doc, applier) {
    _.each(doc.contents, function (content) {
    if (content.type == "element") {
    applier(content.name, GetElemText(content));
    }
}
);
}
;
    var GetElem = function (doc, name) {
    return _.find(doc.contents, function (content) {
    return (content.type == "element" && content.name == name);
}
);
}
;
    var GetElems = function (doc, name) {
    return _.filter(doc.contents, function (content) {
    return (content.type == "element" && content.name == name);
}
);
}
;
    var GetAttr = function (doc, name) {
    return doc.attributes[name];
}
;
    var GetElemText = function (doc) {
    if (doc && _.isArray(doc.contents) && doc.contents.length > 0) {
    var content = doc.contents[0];
    if (content.type === "chardata" && content.value) {
    return content.value.trim();
    }
    }
}
;
    var iterateValue = function (elemName, arg) {
    return (_.isFunction(elemName)?elemName(arg):elemName);
}
;
    var CreateSimpleElem = function (elemName, wxName, applier) {
    return (function (xrc, parent, opts) {
    var label = GetElemText(GetElem(xrc, "label"));
    var sizeObj = GetElem(xrc, "size");
    var name = GetAttr(xrc, "name");
    return {loc:{start:{line:87, column:11}, end:{line:97, column:21}, source:null}, type:"Program", body:[{loc:{start:{line:88, column:7}, end:{line:97, column:21}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:88, column:7}, end:{line:97, column:18}, source:null}, type:"CallExpression", callee:{loc:{start:{line:88, column:7}, end:{line:97, column:6}, source:null}, type:"FunctionExpression", id:null, params:[{loc:{start:{line:88, column:17}, end:{line:88, column:23}, source:null}, type:"Identifier", name:"parent"}], defaults:[], body:{loc:{start:{line:88, column:26}, end:{line:96, column:36}, source:null}, type:"BlockStatement", body:meta_escape( true,[{loc:{start:{line:89, column:6}, end:{line:89, column:17}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:89, column:10}, end:{line:89, column:75}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:89, column:10}, end:{line:89, column:75}, source:null}, type:"Identifier", name:"divroot"}, init:{loc:{start:{line:89, column:20}, end:{line:89, column:75}, source:null}, type:"CallExpression", callee:{loc:{start:{line:89, column:20}, end:{line:89, column:42}, source:null}, type:"MemberExpression", object:{loc:{start:{line:89, column:20}, end:{line:89, column:28}, source:null}, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[meta_escapejsvalue( iterateValue(elemName, xrc))]}}]},{loc:{start:{line:96, column:6}, end:{line:96, column:36}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:96, column:6}, end:{line:96, column:33}, source:null}, type:"CallExpression", callee:{loc:{start:{line:96, column:6}, end:{line:96, column:24}, source:null}, type:"MemberExpression", object:{loc:{start:{line:96, column:6}, end:{line:96, column:12}, source:null}, type:"Identifier", name:"parent"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:{start:{line:96, column:26}, end:{line:96, column:33}, source:null}, type:"Identifier", name:"divroot"}]}}],[{index:1,expr:AppendClassAttr({loc:{start:{line:90, column:25}, end:{line:90, column:36}, source:null}, type:"Program", body:[{loc:{start:{line:90, column:28}, end:{line:90, column:36}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:90, column:28}, end:{line:90, column:35}, source:null}, type:"Identifier", name:"divroot"}}]}, wxName, name)},{index:2,expr:(applier?applier({loc:{start:{line:92, column:29}, end:{line:92, column:40}, source:null}, type:"Program", body:[{loc:{start:{line:92, column:32}, end:{line:92, column:40}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:92, column:32}, end:{line:92, column:39}, source:null}, type:"Identifier", name:"divroot"}}]}, xrc, parent, opts):{loc:{start:{line:92, column:67}, end:{line:92, column:70}, source:null}, type:"Program", body:[{loc:{start:{line:92, column:69}, end:{line:92, column:70}, source:null}, type:"EmptyStatement"}]})},{index:3,expr:WXParse_attributeSize(sizeObj, {loc:{start:{line:94, column:40}, end:{line:94, column:51}, source:null}, type:"Program", body:[{loc:{start:{line:94, column:43}, end:{line:94, column:51}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:94, column:43}, end:{line:94, column:50}, source:null}, type:"Identifier", name:"divroot"}}]})},{index:4,expr:ApplyOptions({loc:{start:{line:95, column:22}, end:{line:95, column:33}, source:null}, type:"Program", body:[{loc:{start:{line:95, column:25}, end:{line:95, column:33}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:95, column:25}, end:{line:95, column:32}, source:null}, type:"Identifier", name:"divroot"}}]}, opts)}],true)}, rest:null, generator:false, expression:false}, arguments:meta_escape( true,[],[{index:0,expr:parent}],false)}}]};
    }
);
}
;
    var CreateSimpleElemWithText = function (elemName, wxName, applier) {
    return CreateSimpleElem(elemName, wxName, function (el, xrc, parent, opts) {
    var label = GetElemText(GetElem(xrc, "label"));
    return {loc:{start:{line:105, column:12}, end:{line:109, column:62}, source:null}, type:"Program", body:meta_escape( true,[{loc:{start:{line:106, column:5}, end:{line:106, column:17}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:106, column:9}, end:{line:106, column:52}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:106, column:9}, end:{line:106, column:52}, source:null}, type:"Identifier", name:"textNode"}, init:{loc:{start:{line:106, column:20}, end:{line:106, column:52}, source:null}, type:"CallExpression", callee:{loc:{start:{line:106, column:20}, end:{line:106, column:43}, source:null}, type:"MemberExpression", object:{loc:{start:{line:106, column:20}, end:{line:106, column:28}, source:null}, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createTextNode"}, computed:false}, arguments:[meta_escapejsvalue( label)]}}]},{loc:{start:{line:107, column:6}, end:{line:107, column:36}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:107, column:6}, end:{line:107, column:33}, source:null}, type:"CallExpression", callee:{loc:{start:{line:107, column:6}, end:{line:107, column:23}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:{start:{line:107, column:25}, end:{line:107, column:33}, source:null}, type:"Identifier", name:"textNode"}]}}],[{index:2,expr:WXParse_wxWindow(xrc, el)},{index:3,expr:(applier?applier(el, xrc, parent, opts):{loc:{start:{line:109, column:54}, end:{line:109, column:57}, source:null}, type:"Program", body:[{loc:{start:{line:109, column:56}, end:{line:109, column:57}, source:null}, type:"EmptyStatement"}]})}],true)};
}
);
}
;
    var CreateListElem = function (elemName, wxName, applier) {
    return (function (xrc, parent, opts) {
    var name = GetAttr(xrc, "name");
    var sizeObj = GetElem(xrc, "size");
    return {loc:{start:{line:121, column:11}, end:{line:131, column:21}, source:null}, type:"Program", body:[{loc:{start:{line:122, column:7}, end:{line:131, column:21}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:122, column:7}, end:{line:131, column:18}, source:null}, type:"CallExpression", callee:{loc:{start:{line:122, column:7}, end:{line:131, column:6}, source:null}, type:"FunctionExpression", id:null, params:[{loc:{start:{line:122, column:17}, end:{line:122, column:23}, source:null}, type:"Identifier", name:"parent"}], defaults:[], body:{loc:{start:{line:122, column:26}, end:{line:130, column:36}, source:null}, type:"BlockStatement", body:meta_escape( true,[{loc:{start:{line:123, column:6}, end:{line:123, column:17}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:123, column:10}, end:{line:123, column:54}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:123, column:10}, end:{line:123, column:54}, source:null}, type:"Identifier", name:"divroot"}, init:{loc:{start:{line:123, column:20}, end:{line:123, column:54}, source:null}, type:"CallExpression", callee:{loc:{start:{line:123, column:20}, end:{line:123, column:42}, source:null}, type:"MemberExpression", object:{loc:{start:{line:123, column:20}, end:{line:123, column:28}, source:null}, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[meta_escapejsvalue( elemName)]}}]},{loc:{start:{line:130, column:6}, end:{line:130, column:36}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:130, column:6}, end:{line:130, column:33}, source:null}, type:"CallExpression", callee:{loc:{start:{line:130, column:6}, end:{line:130, column:24}, source:null}, type:"MemberExpression", object:{loc:{start:{line:130, column:6}, end:{line:130, column:12}, source:null}, type:"Identifier", name:"parent"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:{start:{line:130, column:26}, end:{line:130, column:33}, source:null}, type:"Identifier", name:"divroot"}]}}],[{index:1,expr:AppendClassAttr({loc:{start:{line:124, column:25}, end:{line:124, column:36}, source:null}, type:"Program", body:[{loc:{start:{line:124, column:28}, end:{line:124, column:36}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:124, column:28}, end:{line:124, column:35}, source:null}, type:"Identifier", name:"divroot"}}]}, wxName, name)},{index:2,expr:(applier?applier({loc:{start:{line:126, column:29}, end:{line:126, column:40}, source:null}, type:"Program", body:[{loc:{start:{line:126, column:32}, end:{line:126, column:40}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:126, column:32}, end:{line:126, column:39}, source:null}, type:"Identifier", name:"divroot"}}]}, xrc, parent, opts):{loc:{start:{line:126, column:67}, end:{line:126, column:70}, source:null}, type:"Program", body:[{loc:{start:{line:126, column:69}, end:{line:126, column:70}, source:null}, type:"EmptyStatement"}]})},{index:3,expr:WXParse_attributeSize(sizeObj, {loc:{start:{line:128, column:40}, end:{line:128, column:51}, source:null}, type:"Program", body:[{loc:{start:{line:128, column:43}, end:{line:128, column:51}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:128, column:43}, end:{line:128, column:50}, source:null}, type:"Identifier", name:"divroot"}}]})},{index:4,expr:ApplyOptions({loc:{start:{line:129, column:22}, end:{line:129, column:33}, source:null}, type:"Program", body:[{loc:{start:{line:129, column:25}, end:{line:129, column:33}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:129, column:25}, end:{line:129, column:32}, source:null}, type:"Identifier", name:"divroot"}}]}, opts)}],true)}, rest:null, generator:false, expression:false}, arguments:meta_escape( true,[],[{index:0,expr:parent}],false)}}]};
    }
);
}
;
    var StyleContainsAlignRight = function (xrc) {
    if (xrc) {
    var alignText = GetElemText(xrc);
    return (alignText && alignText.indexOf("wxALIGN_RIGHT") !== -1);
    }
    return false;
}
;
    var AppendClassAttr = function (el) {
    var newClassVals = _.map(_.rest(arguments), function (arg) {
    return arg;
}
).join(" ");
    return {loc:{start:{line:149, column:10}, end:{line:150, column:98}, source:null}, type:"Program", body:[{loc:{start:{line:150, column:5}, end:{line:150, column:98}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:150, column:5}, end:{line:150, column:95}, source:null}, type:"CallExpression", callee:{loc:{start:{line:150, column:5}, end:{line:150, column:23}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:{start:{line:150, column:25}, end:{line:150, column:32}, source:null}, type:"Literal", value:"class"},{loc:{start:{line:150, column:36}, end:{line:150, column:95}, source:null}, type:"BinaryExpression", operator:"+", left:{loc:{start:{line:150, column:36}, end:{line:150, column:78}, source:null}, type:"BinaryExpression", operator:"+", left:{loc:{start:{line:150, column:36}, end:{line:150, column:71}, source:null}, type:"LogicalExpression", operator:"||", left:{loc:{start:{line:150, column:36}, end:{line:150, column:63}, source:null}, type:"CallExpression", callee:{loc:{start:{line:150, column:36}, end:{line:150, column:54}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"getAttribute"}, computed:false}, arguments:[{loc:{start:{line:150, column:56}, end:{line:150, column:63}, source:null}, type:"Literal", value:"class"}]}, right:{loc:{start:{line:150, column:69}, end:{line:150, column:71}, source:null}, type:"Literal", value:""}}, right:{loc:{start:{line:150, column:75}, end:{line:150, column:78}, source:null}, type:"Literal", value:" "}}, right:meta_escapejsvalue( newClassVals)}]}}]};
}
;
    var WXParse_wxWindow = (function () {
    var wxWindowFontObjs = {size: function (el, val) {
    val = +val;
    return (val === -1?{loc:{start:{line:158, column:25}, end:{line:158, column:28}, source:null}, type:"Program", body:[{loc:{start:{line:158, column:27}, end:{line:158, column:28}, source:null}, type:"EmptyStatement"}]}:{loc:{start:{line:158, column:33}, end:{line:159, column:56}, source:null}, type:"Program", body:[{loc:{start:{line:159, column:7}, end:{line:159, column:56}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:159, column:7}, end:{line:159, column:53}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:159, column:7}, end:{line:159, column:27}, source:null}, type:"MemberExpression", object:{loc:{start:{line:159, column:7}, end:{line:159, column:18}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"style"}, computed:false}, property:{loc:null, type:"Identifier", name:"fontSize"}, computed:false}, right:meta_escapejsvalue( (val + 10 + "px"))}}]});
}
,underlined: function (el, val) {
    var css = +val === 0?"initial":"underline";
    return {loc:{start:{line:164, column:12}, end:{line:165, column:42}, source:null}, type:"Program", body:[{loc:{start:{line:165, column:7}, end:{line:165, column:42}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:165, column:7}, end:{line:165, column:41}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:165, column:7}, end:{line:165, column:33}, source:null}, type:"MemberExpression", object:{loc:{start:{line:165, column:7}, end:{line:165, column:18}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"style"}, computed:false}, property:{loc:null, type:"Identifier", name:"textDecoration"}, computed:false}, right:meta_escapejsvalue( css)}}]};
}
};
    return (function (xrc, el) {
    var applingAst = {loc:{start:{line:171, column:21}, end:{line:171, column:25}, source:null}, type:"Program", body:[{loc:{start:{line:171, column:24}, end:{line:171, column:25}, source:null}, type:"EmptyStatement"}]};
    var fontObj = GetElem(xrc, "font");
    if (fontObj) {
    ApplyToElems(fontObj, function (name, val) {
    var wxWindowFontObj = wxWindowFontObjs[name];
    if (wxWindowFontObj) {
    applingAst = {loc:{start:{line:177, column:20}, end:{line:180, column:37}, source:null}, type:"Program", body:meta_escape( true,[],[{index:0,expr:applingAst},{index:1,expr:wxWindowFontObj(el, val)}],true)};
    }
}
);
    }
    return applingAst;
    }
);
}
)();
    var WXParse_attributeSize = function (xrc, el) {
    var sizeText = GetElemText(xrc);
    if (sizeText) {
    var dimStr = sizeText.split(",");
    return {loc:{start:{line:193, column:11}, end:{line:195, column:50}, source:null}, type:"Program", body:[{loc:{start:{line:194, column:5}, end:{line:194, column:49}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:194, column:5}, end:{line:194, column:46}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:194, column:5}, end:{line:194, column:22}, source:null}, type:"MemberExpression", object:{loc:{start:{line:194, column:5}, end:{line:194, column:16}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"style"}, computed:false}, property:{loc:null, type:"Identifier", name:"width"}, computed:false}, right:meta_escapejsvalue( (+dimStr[0] + "px"))}},{loc:{start:{line:195, column:5}, end:{line:195, column:50}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:195, column:5}, end:{line:195, column:47}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:195, column:5}, end:{line:195, column:23}, source:null}, type:"MemberExpression", object:{loc:{start:{line:195, column:5}, end:{line:195, column:16}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"style"}, computed:false}, property:{loc:null, type:"Identifier", name:"height"}, computed:false}, right:meta_escapejsvalue( (+dimStr[1] + "px"))}}]};
    } else {
    return {loc:{start:{line:198, column:11}, end:{line:198, column:15}, source:null}, type:"Program", body:[{loc:{start:{line:198, column:14}, end:{line:198, column:15}, source:null}, type:"EmptyStatement"}]};
    }
}
;
    var WXParse_attributeFlag = (function () {
    var alignCenter = function (el) {
    return {loc:{start:{line:219, column:11}, end:{line:220, column:39}, source:null}, type:"Program", body:[{loc:{start:{line:220, column:6}, end:{line:220, column:39}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:220, column:6}, end:{line:220, column:38}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:220, column:6}, end:{line:220, column:27}, source:null}, type:"MemberExpression", object:{loc:{start:{line:220, column:6}, end:{line:220, column:17}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"style"}, computed:false}, property:{loc:null, type:"Identifier", name:"textAlign"}, computed:false}, right:{loc:{start:{line:220, column:30}, end:{line:220, column:38}, source:null}, type:"Literal", value:"center"}}}]};
}
;
    var flags = {wxALIGN_BOTTOM: null,wxALIGN_CENTER: alignCenter,wxALIGN_CENTER_HORIZONTAL: alignCenter,wxALIGN_CENTER_VERTICAL: null,wxALIGN_LEFT: function (el) {
    return {loc:{start:{line:230, column:12}, end:{line:231, column:34}, source:null}, type:"Program", body:[{loc:{start:{line:231, column:7}, end:{line:231, column:34}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:231, column:7}, end:{line:231, column:33}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:231, column:7}, end:{line:231, column:24}, source:null}, type:"MemberExpression", object:{loc:{start:{line:231, column:7}, end:{line:231, column:18}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"style"}, computed:false}, property:{loc:null, type:"Identifier", name:"float"}, computed:false}, right:{loc:{start:{line:231, column:27}, end:{line:231, column:33}, source:null}, type:"Literal", value:"left"}}}]};
}
,wxALIGN_RIGHT: function (el) {
    return {loc:{start:{line:235, column:12}, end:{line:236, column:35}, source:null}, type:"Program", body:[{loc:{start:{line:236, column:7}, end:{line:236, column:35}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:236, column:7}, end:{line:236, column:34}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:236, column:7}, end:{line:236, column:24}, source:null}, type:"MemberExpression", object:{loc:{start:{line:236, column:7}, end:{line:236, column:18}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"style"}, computed:false}, property:{loc:null, type:"Identifier", name:"float"}, computed:false}, right:{loc:{start:{line:236, column:27}, end:{line:236, column:34}, source:null}, type:"Literal", value:"right"}}}]};
}
,wxALIGN_TOP: null,wxALL: function (el, border) {
    return {loc:{start:{line:241, column:12}, end:{line:242, column:47}, source:null}, type:"Program", body:[{loc:{start:{line:242, column:7}, end:{line:242, column:47}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:242, column:7}, end:{line:242, column:46}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:242, column:7}, end:{line:242, column:26}, source:null}, type:"MemberExpression", object:{loc:{start:{line:242, column:7}, end:{line:242, column:18}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"style"}, computed:false}, property:{loc:null, type:"Identifier", name:"padding"}, computed:false}, right:{loc:{start:{line:242, column:29}, end:{line:242, column:46}, source:null}, type:"BinaryExpression", operator:"+", left:meta_escapejsvalue( border), right:{loc:{start:{line:242, column:42}, end:{line:242, column:46}, source:null}, type:"Literal", value:"px"}}}}]};
}
,wxBOTTOM: function (el, border) {
    return {loc:{start:{line:246, column:12}, end:{line:247, column:53}, source:null}, type:"Program", body:[{loc:{start:{line:247, column:7}, end:{line:247, column:53}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:247, column:7}, end:{line:247, column:52}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:247, column:7}, end:{line:247, column:32}, source:null}, type:"MemberExpression", object:{loc:{start:{line:247, column:7}, end:{line:247, column:18}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"style"}, computed:false}, property:{loc:null, type:"Identifier", name:"paddingBottom"}, computed:false}, right:{loc:{start:{line:247, column:35}, end:{line:247, column:52}, source:null}, type:"BinaryExpression", operator:"+", left:meta_escapejsvalue( border), right:{loc:{start:{line:247, column:48}, end:{line:247, column:52}, source:null}, type:"Literal", value:"px"}}}}]};
}
,wxEXPAND: function (el, border) {
    return {loc:{start:{line:251, column:12}, end:{line:252, column:37}, source:null}, type:"Program", body:[{loc:{start:{line:252, column:7}, end:{line:252, column:37}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:252, column:7}, end:{line:252, column:36}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:252, column:7}, end:{line:252, column:26}, source:null}, type:"MemberExpression", object:{loc:{start:{line:252, column:7}, end:{line:252, column:18}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"style"}, computed:false}, property:{loc:null, type:"Identifier", name:"display"}, computed:false}, right:{loc:{start:{line:252, column:29}, end:{line:252, column:36}, source:null}, type:"Literal", value:"block"}}}]};
}
,wxFIXED_MINSIZE: null,wxLEFT: function (el, border) {
    return {loc:{start:{line:257, column:12}, end:{line:258, column:51}, source:null}, type:"Program", body:[{loc:{start:{line:258, column:7}, end:{line:258, column:51}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:258, column:7}, end:{line:258, column:50}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:258, column:7}, end:{line:258, column:30}, source:null}, type:"MemberExpression", object:{loc:{start:{line:258, column:7}, end:{line:258, column:18}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"style"}, computed:false}, property:{loc:null, type:"Identifier", name:"paddingLeft"}, computed:false}, right:{loc:{start:{line:258, column:33}, end:{line:258, column:50}, source:null}, type:"BinaryExpression", operator:"+", left:meta_escapejsvalue( border), right:{loc:{start:{line:258, column:46}, end:{line:258, column:50}, source:null}, type:"Literal", value:"px"}}}}]};
}
,wxRIGHT: function (el, border) {
    return {loc:{start:{line:262, column:12}, end:{line:263, column:52}, source:null}, type:"Program", body:[{loc:{start:{line:263, column:7}, end:{line:263, column:52}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:263, column:7}, end:{line:263, column:51}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:263, column:7}, end:{line:263, column:31}, source:null}, type:"MemberExpression", object:{loc:{start:{line:263, column:7}, end:{line:263, column:18}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"style"}, computed:false}, property:{loc:null, type:"Identifier", name:"paddingRight"}, computed:false}, right:{loc:{start:{line:263, column:34}, end:{line:263, column:51}, source:null}, type:"BinaryExpression", operator:"+", left:meta_escapejsvalue( border), right:{loc:{start:{line:263, column:47}, end:{line:263, column:51}, source:null}, type:"Literal", value:"px"}}}}]};
}
,wxSHAPED: null,wxTOP: function (el, border) {
    return {loc:{start:{line:268, column:12}, end:{line:269, column:50}, source:null}, type:"Program", body:[{loc:{start:{line:269, column:7}, end:{line:269, column:50}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:269, column:7}, end:{line:269, column:49}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:269, column:7}, end:{line:269, column:29}, source:null}, type:"MemberExpression", object:{loc:{start:{line:269, column:7}, end:{line:269, column:18}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"style"}, computed:false}, property:{loc:null, type:"Identifier", name:"paddingTop"}, computed:false}, right:{loc:{start:{line:269, column:32}, end:{line:269, column:49}, source:null}, type:"BinaryExpression", operator:"+", left:meta_escapejsvalue( border), right:{loc:{start:{line:269, column:45}, end:{line:269, column:49}, source:null}, type:"Literal", value:"px"}}}}]};
}
};
    return (function (el, xrc, border) {
    var flagsText = GetElemText(xrc);
    var applingAst = {loc:{start:{line:277, column:21}, end:{line:277, column:25}, source:null}, type:"Program", body:[{loc:{start:{line:277, column:24}, end:{line:277, column:25}, source:null}, type:"EmptyStatement"}]};
    if (!flagsText) {
    return applingAst;
    }
    var flagsStr = flagsText.split("|");
    _.each(flagsStr, function (flagStr) {
    flagStr = flagStr.trim();
    var flag = flags[flagStr];
    if (flag) {
    var flagAst = flag(el, border);
    applingAst = {loc:{start:{line:290, column:19}, end:{line:290, column:46}, source:null}, type:"Program", body:meta_escape( true,[],[{index:0,expr:applingAst},{index:1,expr:flagAst}],true)};
    }
}
);
    return applingAst;
    }
);
}
)();
    var WXParse_objectStaticText = CreateSimpleElemWithText("label", "wx-wxStaticText", function (el, xrc, parent, opts) {
    return {loc:{start:{line:298, column:10}, end:{line:298, column:44}, source:null}, type:"Program", body:[{loc:{start:{line:298, column:14}, end:{line:298, column:44}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:298, column:14}, end:{line:298, column:43}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:298, column:14}, end:{line:298, column:33}, source:null}, type:"MemberExpression", object:{loc:{start:{line:298, column:14}, end:{line:298, column:25}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"style"}, computed:false}, property:{loc:null, type:"Identifier", name:"display"}, computed:false}, right:{loc:{start:{line:298, column:36}, end:{line:298, column:43}, source:null}, type:"Literal", value:"block"}}}]};
}
);
    var WXParse_objectChoice = CreateListElem("select", "wx-wxChoice", function (el, xrc, parent, opts) {
    var itemsObj = GetElems(GetElem(xrc, "content"), "item");
    var itemsEl = {loc:{start:{line:303, column:17}, end:{line:303, column:21}, source:null}, type:"Program", body:[{loc:{start:{line:303, column:20}, end:{line:303, column:21}, source:null}, type:"EmptyStatement"}]};
    _.each(itemsObj, function (itemObj) {
    var itemLabel = GetElemText(itemObj);
    itemsEl = {loc:{start:{line:306, column:14}, end:{line:312, column:34}, source:null}, type:"Program", body:meta_escape( true,[{loc:{start:{line:309, column:5}, end:{line:309, column:15}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:309, column:9}, end:{line:309, column:50}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:309, column:9}, end:{line:309, column:50}, source:null}, type:"Identifier", name:"option"}, init:{loc:{start:{line:309, column:18}, end:{line:309, column:50}, source:null}, type:"CallExpression", callee:{loc:{start:{line:309, column:18}, end:{line:309, column:40}, source:null}, type:"MemberExpression", object:{loc:{start:{line:309, column:18}, end:{line:309, column:26}, source:null}, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:{start:{line:309, column:42}, end:{line:309, column:50}, source:null}, type:"Literal", value:"option"}]}}]},{loc:{start:{line:310, column:5}, end:{line:310, column:17}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:310, column:9}, end:{line:310, column:56}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:310, column:9}, end:{line:310, column:56}, source:null}, type:"Identifier", name:"textNode"}, init:{loc:{start:{line:310, column:20}, end:{line:310, column:56}, source:null}, type:"CallExpression", callee:{loc:{start:{line:310, column:20}, end:{line:310, column:43}, source:null}, type:"MemberExpression", object:{loc:{start:{line:310, column:20}, end:{line:310, column:28}, source:null}, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createTextNode"}, computed:false}, arguments:[meta_escapejsvalue( itemLabel)]}}]},{loc:{start:{line:311, column:5}, end:{line:311, column:36}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:311, column:5}, end:{line:311, column:33}, source:null}, type:"CallExpression", callee:{loc:{start:{line:311, column:5}, end:{line:311, column:23}, source:null}, type:"MemberExpression", object:{loc:{start:{line:311, column:5}, end:{line:311, column:11}, source:null}, type:"Identifier", name:"option"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:{start:{line:311, column:25}, end:{line:311, column:33}, source:null}, type:"Identifier", name:"textNode"}]}},{loc:{start:{line:312, column:6}, end:{line:312, column:34}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:312, column:6}, end:{line:312, column:31}, source:null}, type:"CallExpression", callee:{loc:{start:{line:312, column:6}, end:{line:312, column:23}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:{start:{line:312, column:25}, end:{line:312, column:31}, source:null}, type:"Identifier", name:"option"}]}}],[{index:0,expr:itemsEl}],true)};
}
);
    return itemsEl;
}
);
    var WXParse_spacer = CreateSimpleElem("div", "wx-spacer");
    var WXParse_objectButton = CreateSimpleElemWithText("button", "wx-wxButton");
    var WXParse_objectText = CreateSimpleElem(function (xrc) {
    var style = GetElem(xrc, "style");
    if (style) {
    style = GetElemText(style);
    if (style.indexOf("wxTE_MULTILINE") !== -1) {
    return "textarea";
    }
    }
    return "input";
}
, "wx-wxTextCtrl");
    var WXParse_objectCheckBox = CreateListElem("div", "wx-wxCheckBox-container", function (el, xrc, parent, opts) {
    var label = GetElemText(GetElem(xrc, "label")), alignRight = StyleContainsAlignRight(GetElem(xrc, "style")), name = GetAttr(xrc, "name");
    var labelAst = label?{loc:{start:{line:339, column:26}, end:{line:344, column:34}, source:null}, type:"Program", body:[{loc:{start:{line:340, column:5}, end:{line:340, column:14}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:340, column:9}, end:{line:340, column:48}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:340, column:9}, end:{line:340, column:48}, source:null}, type:"Identifier", name:"label"}, init:{loc:{start:{line:340, column:17}, end:{line:340, column:48}, source:null}, type:"CallExpression", callee:{loc:{start:{line:340, column:17}, end:{line:340, column:39}, source:null}, type:"MemberExpression", object:{loc:{start:{line:340, column:17}, end:{line:340, column:25}, source:null}, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:{start:{line:340, column:41}, end:{line:340, column:48}, source:null}, type:"Literal", value:"label"}]}}]},{loc:{start:{line:341, column:5}, end:{line:341, column:58}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:341, column:5}, end:{line:341, column:55}, source:null}, type:"CallExpression", callee:{loc:{start:{line:341, column:5}, end:{line:341, column:23}, source:null}, type:"MemberExpression", object:{loc:{start:{line:341, column:5}, end:{line:341, column:10}, source:null}, type:"Identifier", name:"label"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:{start:{line:341, column:25}, end:{line:341, column:32}, source:null}, type:"Literal", value:"class"},{loc:{start:{line:341, column:34}, end:{line:341, column:55}, source:null}, type:"Literal", value:"wx-wxCheckBox-label"}]}},{loc:{start:{line:342, column:5}, end:{line:342, column:17}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:342, column:9}, end:{line:342, column:52}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:342, column:9}, end:{line:342, column:52}, source:null}, type:"Identifier", name:"textNode"}, init:{loc:{start:{line:342, column:20}, end:{line:342, column:52}, source:null}, type:"CallExpression", callee:{loc:{start:{line:342, column:20}, end:{line:342, column:43}, source:null}, type:"MemberExpression", object:{loc:{start:{line:342, column:20}, end:{line:342, column:28}, source:null}, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createTextNode"}, computed:false}, arguments:[meta_escapejsvalue( label)]}}]},{loc:{start:{line:343, column:5}, end:{line:343, column:35}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:343, column:5}, end:{line:343, column:32}, source:null}, type:"CallExpression", callee:{loc:{start:{line:343, column:5}, end:{line:343, column:22}, source:null}, type:"MemberExpression", object:{loc:{start:{line:343, column:5}, end:{line:343, column:10}, source:null}, type:"Identifier", name:"label"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:{start:{line:343, column:24}, end:{line:343, column:32}, source:null}, type:"Identifier", name:"textNode"}]}},{loc:{start:{line:344, column:5}, end:{line:344, column:34}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:344, column:5}, end:{line:344, column:31}, source:null}, type:"CallExpression", callee:{loc:{start:{line:344, column:5}, end:{line:344, column:24}, source:null}, type:"MemberExpression", object:{loc:{start:{line:344, column:5}, end:{line:344, column:12}, source:null}, type:"Identifier", name:"divroot"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:{start:{line:344, column:26}, end:{line:344, column:31}, source:null}, type:"Identifier", name:"label"}]}}]}:{loc:{start:{line:345, column:9}, end:{line:345, column:13}, source:null}, type:"Program", body:[{loc:{start:{line:345, column:12}, end:{line:345, column:13}, source:null}, type:"EmptyStatement"}]};
    var inputAst = {loc:{start:{line:347, column:18}, end:{line:351, column:33}, source:null}, type:"Program", body:meta_escape( true,[{loc:{start:{line:348, column:4}, end:{line:348, column:13}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:348, column:8}, end:{line:348, column:47}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:348, column:8}, end:{line:348, column:47}, source:null}, type:"Identifier", name:"input"}, init:{loc:{start:{line:348, column:16}, end:{line:348, column:47}, source:null}, type:"CallExpression", callee:{loc:{start:{line:348, column:16}, end:{line:348, column:38}, source:null}, type:"MemberExpression", object:{loc:{start:{line:348, column:16}, end:{line:348, column:24}, source:null}, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:{start:{line:348, column:40}, end:{line:348, column:47}, source:null}, type:"Literal", value:"input"}]}}]},{loc:{start:{line:349, column:4}, end:{line:349, column:28}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:349, column:4}, end:{line:349, column:27}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:349, column:4}, end:{line:349, column:14}, source:null}, type:"MemberExpression", object:{loc:{start:{line:349, column:4}, end:{line:349, column:9}, source:null}, type:"Identifier", name:"input"}, property:{loc:null, type:"Identifier", name:"type"}, computed:false}, right:{loc:{start:{line:349, column:17}, end:{line:349, column:27}, source:null}, type:"Literal", value:"checkbox"}}},{loc:{start:{line:351, column:4}, end:{line:351, column:33}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:351, column:4}, end:{line:351, column:30}, source:null}, type:"CallExpression", callee:{loc:{start:{line:351, column:4}, end:{line:351, column:23}, source:null}, type:"MemberExpression", object:{loc:{start:{line:351, column:4}, end:{line:351, column:11}, source:null}, type:"Identifier", name:"divroot"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:{start:{line:351, column:25}, end:{line:351, column:30}, source:null}, type:"Identifier", name:"input"}]}}],[{index:2,expr:AppendClassAttr({loc:{start:{line:350, column:23}, end:{line:350, column:32}, source:null}, type:"Program", body:[{loc:{start:{line:350, column:26}, end:{line:350, column:32}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:350, column:26}, end:{line:350, column:31}, source:null}, type:"Identifier", name:"input"}}]}, "wx-wxCheckBox", name)}],true)};
    return (alignRight?{loc:{start:{line:353, column:23}, end:{line:353, column:49}, source:null}, type:"Program", body:meta_escape( true,[],[{index:0,expr:inputAst},{index:1,expr:labelAst}],true)}:{loc:{start:{line:353, column:55}, end:{line:353, column:81}, source:null}, type:"Program", body:meta_escape( true,[],[{index:0,expr:labelAst},{index:1,expr:inputAst}],true)});
}
);
    var WXParse_objectListBox = CreateSimpleElem("div", "wx-wxCheckBox");
    var WXParse_objectHyperlinkCtrl = CreateSimpleElemWithText("a", "wx-wxHyperlinkCtrl", function (el, xrc, parent, opts) {
    var url = GetElemText(GetElem(xrc, "url"));
    return {loc:{start:{line:360, column:10}, end:{line:361, column:41}, source:null}, type:"Program", body:[{loc:{start:{line:361, column:5}, end:{line:361, column:41}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:361, column:5}, end:{line:361, column:38}, source:null}, type:"CallExpression", callee:{loc:{start:{line:361, column:5}, end:{line:361, column:23}, source:null}, type:"MemberExpression", object:meta_escape( false,el,false), property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:{start:{line:361, column:25}, end:{line:361, column:31}, source:null}, type:"Literal", value:"href"},meta_escapejsvalue( url)]}}]};
}
);
    var ApplyOptions = function (el, opts) {
    if (_.has(opts, "flagObj")) {
    WX_GrammarCheckCond(opts.borderObj, "contain flagObj but not borderObj ");
    var border = +GetElemText(opts.borderObj);
    return WXParse_attributeFlag(el, opts.flagObj, border);
    }
    return {loc:{start:{line:371, column:10}, end:{line:371, column:14}, source:null}, type:"Program", body:[{loc:{start:{line:371, column:13}, end:{line:371, column:14}, source:null}, type:"EmptyStatement"}]};
}
;
    var WXParse_objectBoxSizer = CreateListElem("div", "wx-wxBoxSizer", function (el, xrc, parent, opts) {
    var orient = GetElemText(GetElem(xrc, "orient")), orientClass = orient === "wxVERTICAL"?"wx-vertical":"wx-horizontal", sizerItemsObj = GetElems(xrc, "object"), proportions = [], proportionsSum = 0;
    var itemsEl = {loc:{start:{line:381, column:17}, end:{line:383, column:41}, source:null}, type:"Program", body:meta_escape( true,[{loc:{start:{line:382, column:4}, end:{line:382, column:21}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:382, column:8}, end:{line:382, column:26}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:382, column:8}, end:{line:382, column:26}, source:null}, type:"Identifier", name:"elProportions"}, init:{loc:{start:{line:382, column:24}, end:{line:382, column:26}, source:null}, type:"ArrayExpression", elements:[]}}]}],[{index:1,expr:AppendClassAttr(el, orientClass)}],true)};
    _.each(sizerItemsObj, function (sizerItemObj) {
    var proportion = +GetElemText(GetElem(sizerItemObj, "option")) + 1;
    proportions.push(proportion);
    proportionsSum += proportion;
    itemsEl = {loc:{start:{line:391, column:14}, end:{line:398, column:35}, source:null}, type:"Program", body:meta_escape( true,[{loc:{start:{line:394, column:5}, end:{line:394, column:16}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:394, column:9}, end:{line:394, column:47}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:394, column:9}, end:{line:394, column:47}, source:null}, type:"Identifier", name:"divItem"}, init:{loc:{start:{line:394, column:19}, end:{line:394, column:47}, source:null}, type:"CallExpression", callee:{loc:{start:{line:394, column:19}, end:{line:394, column:41}, source:null}, type:"MemberExpression", object:{loc:{start:{line:394, column:19}, end:{line:394, column:27}, source:null}, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:{start:{line:394, column:42}, end:{line:394, column:47}, source:null}, type:"Literal", value:"div"}]}}]},{loc:{start:{line:395, column:5}, end:{line:395, column:59}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:395, column:5}, end:{line:395, column:56}, source:null}, type:"CallExpression", callee:{loc:{start:{line:395, column:5}, end:{line:395, column:25}, source:null}, type:"MemberExpression", object:{loc:{start:{line:395, column:5}, end:{line:395, column:12}, source:null}, type:"Identifier", name:"divItem"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:{start:{line:395, column:27}, end:{line:395, column:34}, source:null}, type:"Literal", value:"class"},{loc:{start:{line:395, column:36}, end:{line:395, column:56}, source:null}, type:"Literal", value:"wx-wxBoxSizer-item"}]}},{loc:{start:{line:397, column:5}, end:{line:397, column:36}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:397, column:5}, end:{line:397, column:33}, source:null}, type:"CallExpression", callee:{loc:{start:{line:397, column:5}, end:{line:397, column:24}, source:null}, type:"MemberExpression", object:{loc:{start:{line:397, column:5}, end:{line:397, column:12}, source:null}, type:"Identifier", name:"divroot"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:{start:{line:397, column:26}, end:{line:397, column:33}, source:null}, type:"Identifier", name:"divItem"}]}},{loc:{start:{line:398, column:5}, end:{line:398, column:35}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:398, column:5}, end:{line:398, column:32}, source:null}, type:"CallExpression", callee:{loc:{start:{line:398, column:5}, end:{line:398, column:23}, source:null}, type:"MemberExpression", object:{loc:{start:{line:398, column:5}, end:{line:398, column:18}, source:null}, type:"Identifier", name:"elProportions"}, property:{loc:null, type:"Identifier", name:"push"}, computed:false}, arguments:[{loc:{start:{line:398, column:25}, end:{line:398, column:32}, source:null}, type:"Identifier", name:"divItem"}]}}],[{index:0,expr:itemsEl},{index:3,expr:WXParse_objectSizerItem(sizerItemObj, {loc:{start:{line:396, column:46}, end:{line:396, column:57}, source:null}, type:"Program", body:[{loc:{start:{line:396, column:49}, end:{line:396, column:57}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:396, column:49}, end:{line:396, column:56}, source:null}, type:"Identifier", name:"divItem"}}]})}],true)};
}
);
    if (orientClass === "wx-horizontal") {
    itemsEl = {loc:{start:{line:403, column:14}, end:{line:408, column:37}, source:null}, type:"Program", body:meta_escape( true,[{loc:{start:{line:406, column:5}, end:{line:406, column:17}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:406, column:9}, end:{line:406, column:48}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:406, column:9}, end:{line:406, column:48}, source:null}, type:"Identifier", name:"divClear"}, init:{loc:{start:{line:406, column:20}, end:{line:406, column:48}, source:null}, type:"CallExpression", callee:{loc:{start:{line:406, column:20}, end:{line:406, column:42}, source:null}, type:"MemberExpression", object:{loc:{start:{line:406, column:20}, end:{line:406, column:28}, source:null}, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:{start:{line:406, column:43}, end:{line:406, column:48}, source:null}, type:"Literal", value:"div"}]}}]},{loc:{start:{line:407, column:5}, end:{line:407, column:53}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:407, column:5}, end:{line:407, column:50}, source:null}, type:"CallExpression", callee:{loc:{start:{line:407, column:5}, end:{line:407, column:26}, source:null}, type:"MemberExpression", object:{loc:{start:{line:407, column:5}, end:{line:407, column:13}, source:null}, type:"Identifier", name:"divClear"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:{start:{line:407, column:28}, end:{line:407, column:35}, source:null}, type:"Literal", value:"class"},{loc:{start:{line:407, column:37}, end:{line:407, column:50}, source:null}, type:"Literal", value:"wx-clearfix"}]}},{loc:{start:{line:408, column:5}, end:{line:408, column:37}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:408, column:5}, end:{line:408, column:34}, source:null}, type:"CallExpression", callee:{loc:{start:{line:408, column:5}, end:{line:408, column:24}, source:null}, type:"MemberExpression", object:{loc:{start:{line:408, column:5}, end:{line:408, column:12}, source:null}, type:"Identifier", name:"divroot"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:{start:{line:408, column:26}, end:{line:408, column:34}, source:null}, type:"Identifier", name:"divClear"}]}}],[{index:0,expr:itemsEl}],true)};
    }
    _.each(proportions, function (proportion, propIdx) {
    var percProportion = proportion / proportionsSum * 100;
    var widthStyleAst = proportion === 1?{loc:{start:{line:414, column:43}, end:{line:414, column:46}, source:null}, type:"Program", body:[{loc:{start:{line:414, column:45}, end:{line:414, column:46}, source:null}, type:"EmptyStatement"}]}:{loc:{start:{line:414, column:51}, end:{line:417, column:50}, source:null}, type:"Program", body:[{loc:{start:{line:415, column:6}, end:{line:415, column:17}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:415, column:10}, end:{line:415, column:52}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:415, column:10}, end:{line:415, column:52}, source:null}, type:"Identifier", name:"elStyle"}, init:{loc:{start:{line:415, column:20}, end:{line:415, column:52}, source:null}, type:"MemberExpression", object:{loc:{start:{line:415, column:20}, end:{line:415, column:46}, source:null}, type:"MemberExpression", object:{loc:{start:{line:415, column:20}, end:{line:415, column:33}, source:null}, type:"Identifier", name:"elProportions"}, property:meta_escapejsvalue( propIdx), computed:true}, property:{loc:null, type:"Identifier", name:"style"}, computed:false}}]},{loc:{start:{line:416, column:6}, end:{line:417, column:50}, source:null}, type:"IfStatement", test:{loc:{start:{line:416, column:10}, end:{line:416, column:24}, source:null}, type:"UnaryExpression", operator:"!", argument:{loc:{start:{line:416, column:11}, end:{line:416, column:24}, source:null}, type:"MemberExpression", object:{loc:{start:{line:416, column:11}, end:{line:416, column:18}, source:null}, type:"Identifier", name:"elStyle"}, property:{loc:null, type:"Identifier", name:"width"}, computed:false}, prefix:true}, consequent:{loc:{start:{line:416, column:27}, end:{line:417, column:50}, source:null}, type:"BlockStatement", body:[{loc:{start:{line:417, column:7}, end:{line:417, column:50}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:417, column:7}, end:{line:417, column:47}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:417, column:7}, end:{line:417, column:20}, source:null}, type:"MemberExpression", object:{loc:{start:{line:417, column:7}, end:{line:417, column:14}, source:null}, type:"Identifier", name:"elStyle"}, property:{loc:null, type:"Identifier", name:"width"}, computed:false}, right:meta_escapejsvalue( (percProportion + "%"))}}]}, alternate:null}]};
    itemsEl = {loc:{start:{line:420, column:14}, end:{line:423, column:21}, source:null}, type:"Program", body:meta_escape( true,[],[{index:0,expr:itemsEl},{index:1,expr:widthStyleAst}],true)};
}
);
    return itemsEl;
}
);
    var WXParse_objectFlexGridSizer = CreateListElem("div", "wx-wxFlexGridSizer", function (el, xrc, parent, opts) {
    var rows = +GetElemText(GetElem(xrc, "rows")), cols = Math.max(+GetElemText(GetElem(xrc, "cols")), 1), sizerItemsObj = GetElems(xrc, "object"), hasDivRow = false;
    var itemsEl = {loc:{start:{line:436, column:17}, end:{line:436, column:21}, source:null}, type:"Program", body:[{loc:{start:{line:436, column:20}, end:{line:436, column:21}, source:null}, type:"EmptyStatement"}]};
    _(sizerItemsObj.length).times(function (itemIdx) {
    if (itemIdx % cols === 0) {
    if (hasDivRow) {
    itemsEl = {loc:{start:{line:440, column:16}, end:{line:440, column:60}, source:null}, type:"Program", body:meta_escape( true,[{loc:{start:{line:440, column:30}, end:{line:440, column:60}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:440, column:30}, end:{line:440, column:57}, source:null}, type:"CallExpression", callee:{loc:{start:{line:440, column:30}, end:{line:440, column:49}, source:null}, type:"MemberExpression", object:{loc:{start:{line:440, column:30}, end:{line:440, column:37}, source:null}, type:"Identifier", name:"divroot"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:{start:{line:440, column:51}, end:{line:440, column:57}, source:null}, type:"Identifier", name:"divRow"}]}}],[{index:0,expr:itemsEl}],true)};
    }
    itemsEl = {loc:{start:{line:442, column:15}, end:{line:450, column:39}, source:null}, type:"Program", body:meta_escape( true,[{loc:{start:{line:445, column:6}, end:{line:445, column:18}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:445, column:10}, end:{line:445, column:49}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:445, column:10}, end:{line:445, column:49}, source:null}, type:"Identifier", name:"divClear"}, init:{loc:{start:{line:445, column:21}, end:{line:445, column:49}, source:null}, type:"CallExpression", callee:{loc:{start:{line:445, column:21}, end:{line:445, column:43}, source:null}, type:"MemberExpression", object:{loc:{start:{line:445, column:21}, end:{line:445, column:29}, source:null}, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:{start:{line:445, column:44}, end:{line:445, column:49}, source:null}, type:"Literal", value:"div"}]}}]},{loc:{start:{line:446, column:6}, end:{line:446, column:54}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:446, column:6}, end:{line:446, column:51}, source:null}, type:"CallExpression", callee:{loc:{start:{line:446, column:6}, end:{line:446, column:27}, source:null}, type:"MemberExpression", object:{loc:{start:{line:446, column:6}, end:{line:446, column:14}, source:null}, type:"Identifier", name:"divClear"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:{start:{line:446, column:29}, end:{line:446, column:36}, source:null}, type:"Literal", value:"class"},{loc:{start:{line:446, column:38}, end:{line:446, column:51}, source:null}, type:"Literal", value:"wx-clearfix"}]}},{loc:{start:{line:447, column:7}, end:{line:447, column:41}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:447, column:7}, end:{line:447, column:38}, source:null}, type:"CallExpression", callee:{loc:{start:{line:447, column:7}, end:{line:447, column:28}, source:null}, type:"MemberExpression", object:meta_escape( false,parent,false), property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:{start:{line:447, column:30}, end:{line:447, column:38}, source:null}, type:"Identifier", name:"divClear"}]}},{loc:{start:{line:448, column:6}, end:{line:448, column:16}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:448, column:10}, end:{line:448, column:47}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:448, column:10}, end:{line:448, column:47}, source:null}, type:"Identifier", name:"divRow"}, init:{loc:{start:{line:448, column:19}, end:{line:448, column:47}, source:null}, type:"CallExpression", callee:{loc:{start:{line:448, column:19}, end:{line:448, column:41}, source:null}, type:"MemberExpression", object:{loc:{start:{line:448, column:19}, end:{line:448, column:27}, source:null}, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:{start:{line:448, column:42}, end:{line:448, column:47}, source:null}, type:"Literal", value:"div"}]}}]},{loc:{start:{line:449, column:6}, end:{line:449, column:63}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:449, column:6}, end:{line:449, column:60}, source:null}, type:"CallExpression", callee:{loc:{start:{line:449, column:6}, end:{line:449, column:25}, source:null}, type:"MemberExpression", object:{loc:{start:{line:449, column:6}, end:{line:449, column:12}, source:null}, type:"Identifier", name:"divRow"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:{start:{line:449, column:27}, end:{line:449, column:34}, source:null}, type:"Literal", value:"class"},{loc:{start:{line:449, column:36}, end:{line:449, column:60}, source:null}, type:"Literal", value:"wx-wxFlexGridSizer-row"}]}},{loc:{start:{line:450, column:7}, end:{line:450, column:39}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:450, column:7}, end:{line:450, column:36}, source:null}, type:"CallExpression", callee:{loc:{start:{line:450, column:7}, end:{line:450, column:28}, source:null}, type:"MemberExpression", object:meta_escape( false,parent,false), property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:{start:{line:450, column:30}, end:{line:450, column:36}, source:null}, type:"Identifier", name:"divRow"}]}}],[{index:0,expr:itemsEl}],true)};
    }
    hasDivRow = true;
    itemsEl = {loc:{start:{line:454, column:14}, end:{line:460, column:34}, source:null}, type:"Program", body:meta_escape( true,[{loc:{start:{line:457, column:5}, end:{line:457, column:15}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:457, column:9}, end:{line:457, column:46}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:457, column:9}, end:{line:457, column:46}, source:null}, type:"Identifier", name:"divCol"}, init:{loc:{start:{line:457, column:18}, end:{line:457, column:46}, source:null}, type:"CallExpression", callee:{loc:{start:{line:457, column:18}, end:{line:457, column:40}, source:null}, type:"MemberExpression", object:{loc:{start:{line:457, column:18}, end:{line:457, column:26}, source:null}, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:{start:{line:457, column:41}, end:{line:457, column:46}, source:null}, type:"Literal", value:"div"}]}}]},{loc:{start:{line:458, column:5}, end:{line:458, column:62}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:458, column:5}, end:{line:458, column:59}, source:null}, type:"CallExpression", callee:{loc:{start:{line:458, column:5}, end:{line:458, column:24}, source:null}, type:"MemberExpression", object:{loc:{start:{line:458, column:5}, end:{line:458, column:11}, source:null}, type:"Identifier", name:"divCol"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:{start:{line:458, column:26}, end:{line:458, column:33}, source:null}, type:"Literal", value:"class"},{loc:{start:{line:458, column:35}, end:{line:458, column:59}, source:null}, type:"Literal", value:"wx-wxFlexGridSizer-col"}]}},{loc:{start:{line:460, column:5}, end:{line:460, column:34}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:460, column:5}, end:{line:460, column:31}, source:null}, type:"CallExpression", callee:{loc:{start:{line:460, column:5}, end:{line:460, column:23}, source:null}, type:"MemberExpression", object:{loc:{start:{line:460, column:5}, end:{line:460, column:11}, source:null}, type:"Identifier", name:"divRow"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:{start:{line:460, column:25}, end:{line:460, column:31}, source:null}, type:"Identifier", name:"divCol"}]}}],[{index:0,expr:itemsEl},{index:3,expr:WXParse_objectSizerItem(sizerItemsObj[itemIdx], {loc:{start:{line:459, column:58}, end:{line:459, column:68}, source:null}, type:"Program", body:[{loc:{start:{line:459, column:61}, end:{line:459, column:68}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:459, column:61}, end:{line:459, column:67}, source:null}, type:"Identifier", name:"divCol"}}]})}],true)};
}
);
    return itemsEl;
}
);
    var WXParse_objectSizer = (function () {
    var sizers = {"wxBoxSizer": WXParse_objectBoxSizer,"wxFlexGridSizer": WXParse_objectFlexGridSizer};
    return (function (xrc, parent) {
    var classType = GetAttr(xrc, "class");
    var sizer = sizers[classType];
    WX_GrammarCheckCond(sizer, "sizer: " + classType);
    return sizer(xrc, parent);
    }
);
}
)();
    var WXParse_objectPanel = CreateSimpleElem("div", "wx-panel", function (el, xrc, parent, opts) {
    var sizerObj = GetElem(xrc, "object");
    return (sizerObj?WXParse_objectSizer(sizerObj, {loc:{start:{line:484, column:52}, end:{line:484, column:63}, source:null}, type:"Program", body:[{loc:{start:{line:484, column:55}, end:{line:484, column:63}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:484, column:55}, end:{line:484, column:62}, source:null}, type:"Identifier", name:"divroot"}}]}):{loc:{start:{line:484, column:71}, end:{line:484, column:75}, source:null}, type:"Program", body:[{loc:{start:{line:484, column:74}, end:{line:484, column:75}, source:null}, type:"EmptyStatement"}]});
}
);
    var WXParse_objectSizerItem = (function () {
    var items = {"wxPanel": WXParse_objectPanel,"wxBoxSizer": WXParse_objectBoxSizer,"wxStaticText": WXParse_objectStaticText,"wxChoice": WXParse_objectChoice,"wxButton": WXParse_objectButton,"wxTextCtrl": WXParse_objectText,"wxCheckBox": WXParse_objectCheckBox,"wxListBox": WXParse_objectListBox,"wxHyperlinkCtrl": WXParse_objectHyperlinkCtrl};
    return (function (xrc, parent) {
    var itemStyle = {borderObj: GetElem(xrc, "border"),flagObj: GetElem(xrc, "flag")};
    var parentClassType = GetAttr(xrc, "class");
    if (parentClassType === "spacer") {
    return WXParse_spacer(xrc, parent, itemStyle);
    } else {
    var itemObj = GetElem(xrc, "object");
    var classType = GetAttr(itemObj, "class");
    var item = items[classType];
    WX_GrammarCheckCond(item, "unsupposed wx item: " + classType);
    return item(itemObj, parent, itemStyle);
    }
    }
);
}
)();
    var WXParse_resource = function (xrc, functorName) {
    var panelObj = GetElem(xrc, "object");
    return {loc:{start:{line:524, column:10}, end:{line:530, column:6}, source:null}, type:"Program", body:[{loc:{start:{line:525, column:4}, end:{line:530, column:6}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:525, column:4}, end:{line:530, column:5}, source:null}, type:"AssignmentExpression", operator:"=", left:{loc:{start:{line:525, column:4}, end:{line:525, column:35}, source:null}, type:"MemberExpression", object:{loc:{start:{line:525, column:4}, end:{line:525, column:16}, source:null}, type:"Identifier", name:"UIGenerators"}, property:meta_escapejsvalue( functorName), computed:true}, right:{loc:{start:{line:525, column:38}, end:{line:530, column:5}, source:null}, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:{start:{line:525, column:49}, end:{line:529, column:20}, source:null}, type:"BlockStatement", body:meta_escape( true,[{loc:{start:{line:526, column:5}, end:{line:526, column:16}, source:null}, type:"VariableDeclaration", kind:"var", declarations:[{loc:{start:{line:526, column:9}, end:{line:526, column:47}, source:null}, type:"VariableDeclarator", id:{loc:{start:{line:526, column:9}, end:{line:526, column:47}, source:null}, type:"Identifier", name:"divroot"}, init:{loc:{start:{line:526, column:19}, end:{line:526, column:47}, source:null}, type:"CallExpression", callee:{loc:{start:{line:526, column:19}, end:{line:526, column:41}, source:null}, type:"MemberExpression", object:{loc:{start:{line:526, column:19}, end:{line:526, column:27}, source:null}, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:{start:{line:526, column:42}, end:{line:526, column:47}, source:null}, type:"Literal", value:"div"}]}}]},{loc:{start:{line:527, column:5}, end:{line:527, column:52}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:527, column:5}, end:{line:527, column:49}, source:null}, type:"CallExpression", callee:{loc:{start:{line:527, column:5}, end:{line:527, column:25}, source:null}, type:"MemberExpression", object:{loc:{start:{line:527, column:5}, end:{line:527, column:12}, source:null}, type:"Identifier", name:"divroot"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:{start:{line:527, column:27}, end:{line:527, column:34}, source:null}, type:"Literal", value:"class"},{loc:{start:{line:527, column:36}, end:{line:527, column:49}, source:null}, type:"Literal", value:"wx-resource"}]}},{loc:{start:{line:529, column:5}, end:{line:529, column:20}, source:null}, type:"ReturnStatement", argument:{loc:{start:{line:529, column:12}, end:{line:529, column:19}, source:null}, type:"Identifier", name:"divroot"}}],[{index:2,expr:WXParse_objectPanel(panelObj, {loc:{start:{line:528, column:38}, end:{line:528, column:49}, source:null}, type:"Program", body:[{loc:{start:{line:528, column:41}, end:{line:528, column:49}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:528, column:41}, end:{line:528, column:48}, source:null}, type:"Identifier", name:"divroot"}}]})}],true)}, rest:null, generator:false, expression:false}}}]};
}
;
    var WXParse = function (xrc, functorName) {
    var resourceObj = GetElem(xrc, "resource");
    return WXParse_resource(resourceObj, functorName);
}
;
    return WXParse;
    }
)();
    XrcConv.generateUI = (function () {
    var Init = function () {
    load(XML_PARSER_PATH);
}
;
    var GenerateFragmentUI = function (xrcPath, functorName) {
    var xrcStr = read(xrcPath);
    var xrc = Xparse(xrcStr);
    return XrcConv.xrcToHtml(xrc, functorName);
}
;
    var Gen = function () {
    return {loc:{start:{line:555, column:10}, end:{line:561, column:54}, source:null}, type:"Program", body:meta_escape( true,[],[{index:0,expr:GenerateFragmentUI(BASIC_LAYOUT_XRC_PATH, "basicLayout")},{index:1,expr:GenerateFragmentUI(LEFT_MENU_XRC_PATH, "leftMenu")},{index:2,expr:GenerateFragmentUI(EMAIL_LIST_XRC_PATH, "emailList")},{index:3,expr:GenerateFragmentUI(EMAIL_LIST_ITEM_XRC_PATH, "emailListItem")},{index:4,expr:GenerateFragmentUI(COMPOSE_EMAIL_XRC_PATH, "composeEmail")},{index:5,expr:GenerateFragmentUI(HEADER_XRC_PATH, "header")}],true)};
}
;
    return {Init: Init,Gen: Gen};
    }
)();
    XrcConv.generateUI.Init();
}
inline( XrcConv.generateUI.Gen() );