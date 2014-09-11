function astToHtml(xrcFileName, handlers) {
    function Ast_esc(ast, isStmt) {
    return (isStmt?ast.body[0]:ast.body[0].expression);
    }

    function Ast_GetBody(root) {
    return root.body[0].expression.callee.body.body;
    }

    function Ast_PushArg(root, arg) {
    return root.body[0].expression.arguments.push(arg);
    }

    function Ast_appendHandlerToBody(root, handlers, id) {
    var actionAst;
    var handler = handlers[id];
    if (handler) {
    if (handler.evt) {
    actionAst = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"elem"}, property:{loc:null, type:"Literal", value:""}, computed:true}, right:escape( handler.action)}}]};
    actionAst.body[0].expression.left.property.value = handler.evt;
    actionAst.body[0].expression.right = handler.action.body[0].expression;
    } else {
    actionAst = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:escape( handler.action), arguments:[{loc:null, type:"Identifier", name:"elem"}]}}]};
    actionAst.body[0].expression.callee = handler.action.body[0].expression;
    }
    root.splice(root.length - 2, 0, Ast_esc(actionAst, true));
    }
    }

    load("F:\\japostol\\projects\\not\\not\\js\\Project\\TestMonkey\\Src\\GUIGen\\xparse.js");
    var calculatorXrc = read(xrcFileName);
    var doc = Xparse(calculatorXrc);
    function assert(cond, msg) {
    if (!cond) {
    print("assertion fail " + msg?" : \"" + msg + "\"":"");
    }
    }

    function getElemByName(doc, name) {
for (var i = 0; i < doc.contents.length; ++i) {
    var elem = doc.contents[i];
    if (elem.type == "element" && elem.name == name) {
    return elem;
    }
    }
    return null;
    }

    function getAttrByName(doc, name) {
    return doc.attributes[name];
    }

    function getElemValue(doc) {
    if (doc.contents && doc.contents.length > 0 && doc.contents[0].type === "chardata" && doc.contents[0].value) {
    return doc.contents[0].value.trim();
    }
    return null;
    }

    var resourceObj = getElemByName(doc, "resource");
    var panelObj = getElemByName(resourceObj, "object");
    var xrcToAst = {parseItems: {wxBoxSizer: function (obj, parent) {
    var orient = getElemByName(obj, "orient");
    var sizeritems = obj.contents;
    var retVal = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"parent"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"divChild"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"div"}]}}]}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"divChild"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"class"}, {loc:null, type:"Literal", value:""}]}}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"parent"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:null, type:"Identifier", name:"divChild"}]}}]}, rest:null, generator:false, expression:false}, arguments:[escape( parent)]}}]};
    var retValBody = Ast_GetBody(retVal);
    retValBody[1].expression.arguments[1].value = getElemValue(orient) === "wxHORIZONTAL"?"c-row":"c-col";
for (var i = 0; i < sizeritems.length; ++i) {
    var sizeritem = sizeritems[i];
    if (sizeritem.type == "element" && sizeritem.name == "object") {
    var item = this.parseSizerItem(sizeritem, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Identifier", name:"divChild"}}]});
    retValBody.splice(2 + i, 0, Ast_esc(item, true));
    }
    }
    return retVal;
}
,wxTextCtrl: function (obj, parent) {
    var size = getElemByName(obj, "size");
    var value = getElemByName(obj, "value");
    var maxlength = getElemByName(obj, "maxlength");
    var id = getAttrByName(obj, "name");
    var retVal = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"parent"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"elem"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"textarea"}]}}]}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"elem"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"id"}, {loc:null, type:"Literal", value:""}]}}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"elem"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"value"}, {loc:null, type:"Literal", value:""}]}}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"elem"}, property:{loc:null, type:"Identifier", name:"readOnly"}, computed:false}, right:{loc:null, type:"Literal", value:true}}}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"parent"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:null, type:"Identifier", name:"elem"}]}}]}, rest:null, generator:false, expression:false}, arguments:[escape( parent)]}}]};
    var retValBody = Ast_GetBody(retVal);
    retValBody[1].expression.arguments[1].value = id;
    retValBody[2].expression.arguments[1].value = getElemValue(value);
    Ast_appendHandlerToBody(retValBody, handlers, id);
    return retVal;
}
,wxButton: function (obj, parent) {
    var label = getElemByName(obj, "label");
    var id = getAttrByName(obj, "name");
    var retVal = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"parent"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"elem"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"button"}]}}]}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"elem"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"id"}, {loc:null, type:"Literal", value:""}]}}, {loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"textNode"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createTextNode"}, computed:false}, arguments:[{loc:null, type:"Literal", value:""}]}}]}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"elem"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:null, type:"Identifier", name:"textNode"}]}}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"parent"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:null, type:"Identifier", name:"elem"}]}}]}, rest:null, generator:false, expression:false}, arguments:[]}}]};
    var retValBody = Ast_GetBody(retVal);
    retValBody[1].expression.arguments[1].value = id;
    retValBody[2].declarations[0].init.arguments[0].value = getElemValue(label);
    Ast_appendHandlerToBody(retValBody, handlers, id);
    Ast_PushArg(retVal, parent);
    return retVal;
}
,parseSizerItem: function (obj, parent) {
    var option = getElemByName(obj, "option");
    var flag = getElemByName(obj, "flag");
    var border = getElemByName(obj, "border");
    var object = getElemByName(obj, "object");
    var item = this.callParser(object, parent);
    return item;
}
,callParser: function (obj, parent) {
    var classType = getAttrByName(obj, "class");
    var func = this[classType];
    assert(func, "function does not exist");
    var items = this[classType](obj, parent);
    return items;
}
},parsePanel: function (obj, parent) {
    var style = getElemByName(obj, "style");
    var size = getElemByName(obj, "size");
    var object = getElemByName(obj, "object");
    print(escape(parent));
    print(JSON.stringify(escape(parent)));
    print(parent);
    var retVal = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"parent"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"divPanel"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"div"}]}}]}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"parent"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:null, type:"Identifier", name:"divPanel"}]}}]}, rest:null, generator:false, expression:false}, arguments:[]}}]};
    var retValBody = Ast_GetBody(retVal);
    Ast_PushArg(retVal, parent.body[0].expression);
    return retVal;
}
,startParser: function (obj) {
    var retVal = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"divroot"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"div"}]}}]}, {loc:null, type:"ReturnStatement", argument:{loc:null, type:"Identifier", name:"divroot"}}]}, rest:null, generator:false, expression:false}, arguments:[]}}]};
    var retValBody = Ast_GetBody(retVal);
    var items = this.parsePanel(obj, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Identifier", name:"divroot"}}]});
    retValBody.splice(1, 0, Ast_esc(items, true));
    return retVal;
}
};
    return xrcToAst.startParser(panelObj);
}

var calculatorLogic = {textArea: null};
function getHandlers2() {
    return {"c_clear": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"elem"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:""}}}]}, rest:null, generator:false, expression:false}}]}},"c_input": {action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"elem"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, right:{loc:null, type:"Identifier", name:"elem"}}}]}, rest:null, generator:false, expression:false}}]}},"c_plus": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"+"}}}]}, rest:null, generator:false, expression:false}}]}},"c_minus": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"-"}}}]}, rest:null, generator:false, expression:false}}]}},"c_multi": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"*"}}}]}, rest:null, generator:false, expression:false}}]}},"c_div": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"/"}}}]}, rest:null, generator:false, expression:false}}]}},"c_result": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"result"}, init:null}]}, {loc:null, type:"TryStatement", block:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"result"}, right:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"eval"}, arguments:[{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}]}}}]}, guardedHandlers:[], handler:{loc:null, type:"CatchClause", param:{loc:null, type:"Identifier", name:"e"}, guard:null, body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"result"}, right:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"Error"}}}}]}}, finalizer:null}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"BinaryExpression", operator:"+", left:{loc:null, type:"Literal", value:" = "}, right:{loc:null, type:"Identifier", name:"result"}}}}]}, rest:null, generator:false, expression:false}}]}}};
}

var calculatorUI = (function () {
    var divroot = document.createElement("div");
    (function (parent) {
    var divPanel = document.createElement("div");
    parent.appendChild(divPanel);
    }
(divroot));
    return divroot;
}
());
;
var calIdSelector = document.getElementById("calContent");
calIdSelector.appendChild(calculatorUI);
