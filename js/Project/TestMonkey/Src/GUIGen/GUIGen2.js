function astToHtml() {
    function Ast_esc(ast, isStmt) {
    return (isStmt?ast.body[0]:ast.body[0].expression);
    }

    function Ast_GetBody(root) {
    return root.body[0].expression.callee.body.body;
    }

    function Ast_PushArg(root, arg) {
    return root.body[0].expression.arguments.push(arg);
    }

    load("F:\\japostol\\projects\\not\\not\\js\\Project\\TestMonkey\\Src\\GUIGen\\xparse.js");
    var calculatorXrc = read("F:\\japostol\\projects\\not\\not\\js\\Project\\TestMonkey\\Src\\GUIGen\\calculator.xrc");
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
    var xrcToAst = {parseItems: {parent: null,wxBoxSizer: function (obj, parent) {
    var orient = getElemByName(obj, "orient");
    var sizeritems = obj.contents;
    var retVal = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"parent"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"divChild"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"div"}]}}]}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"divChild"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"class"}, {loc:null, type:"Literal", value:""}]}}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"parent"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:null, type:"Identifier", name:"divChild"}]}}]}, rest:null, generator:false, expression:false}, arguments:[]}}]};
    var retValBody = Ast_GetBody(retVal);
    retValBody[1].expression.arguments[1].value = getElemValue(orient);
    var divrootVar = retValBody[0].declarations[0].id;
for (var i = 0; i < sizeritems.length; ++i) {
    var sizeritem = sizeritems[i];
    if (sizeritem.type == "element" && sizeritem.name == "object") {
    var item = this.parent.parseSizerItem(sizeritem, divrootVar);
    retValBody.splice(2 + i, 0, Ast_esc(item, true));
    }
    }
    Ast_PushArg(retVal, parent);
    return retVal;
}
,wxTextCtrl: function (obj, parent) {
    var size = getElemByName(obj, "size");
    var value = getElemByName(obj, "value");
    var maxlength = getElemByName(obj, "maxlength");
    var retVal = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"parent"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"textarea"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"textarea"}]}}]}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"textarea"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"value"}, {loc:null, type:"Literal", value:""}]}}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"parent"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:null, type:"Identifier", name:"textarea"}]}}]}, rest:null, generator:false, expression:false}, arguments:[]}}]};
    var retValBody = Ast_GetBody(retVal);
    retValBody[1].expression.arguments[1].value = getElemValue(value);
    Ast_PushArg(retVal, parent);
    return retVal;
}
,wxButton: function (obj, parent) {
    var label = getElemByName(obj, "label");
    var retVal = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"parent"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"button"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"button"}]}}]}, {loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"textNode"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createTextNode"}, computed:false}, arguments:[{loc:null, type:"Literal", value:""}]}}]}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"button"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:null, type:"Identifier", name:"textNode"}]}}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"parent"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:null, type:"Identifier", name:"button"}]}}]}, rest:null, generator:false, expression:false}, arguments:[]}}]};
    var retValBody = Ast_GetBody(retVal);
    retValBody[1].declarations[0].init.arguments[0].value = getElemValue(label);
    Ast_PushArg(retVal, parent);
    return retVal;
}
,callParser: function (obj, parent) {
    var classType = getAttrByName(obj, "class");
    var func = this[classType];
    assert(func, "function does not exist");
    var items = this[classType](obj, parent);
    return items;
}
},parseSizerItem: function (obj, parent, extra) {
    var option = getElemByName(obj, "option");
    var flag = getElemByName(obj, "flag");
    var border = getElemByName(obj, "border");
    var object = getElemByName(obj, "object");
    var item = this.parseItems.callParser(object, parent);
    return item;
}
,parsePanel: function (obj, parent) {
    var style = getElemByName(obj, "style");
    var size = getElemByName(obj, "size");
    var object = getElemByName(obj, "object");
    var retVal = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"parent"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"divPanel"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"div"}]}}]}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"parent"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:null, type:"Identifier", name:"divPanel"}]}}]}, rest:null, generator:false, expression:false}, arguments:[]}}]};
    var retValBody = Ast_GetBody(retVal);
    var divrootVar = retValBody[0].declarations[0].id;
    var items = this.parseItems.callParser(object, divrootVar);
    retValBody.splice(1, 0, Ast_esc(items, true));
    Ast_PushArg(retVal, parent);
    return retVal;
}
,startParser: function (obj) {
    this.parseItems.parent = this;
    var retVal = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"divroot"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"div"}]}}]}, {loc:null, type:"ReturnStatement", argument:{loc:null, type:"Identifier", name:"divroot"}}]}, rest:null, generator:false, expression:false}, arguments:[]}}]};
    var retValBody = Ast_GetBody(retVal);
    var divrootVar = retValBody[0].declarations[0].id;
    var items = this.parsePanel(obj, divrootVar);
    retValBody.splice(1, 0, Ast_esc(items, true));
    return retVal;
}
};
    return xrcToAst.startParser(panelObj);
}

var calculatorUI = (function () {
    var divroot = document.createElement("div");
    (function (parent) {
    var divPanel = document.createElement("div");
    (function (parent) {
    var divChild = document.createElement("div");
    divChild.setAttribute("class", "wxVERTICAL");
    parent.appendChild(divChild);
    (function (parent) {
    var textarea = document.createElement("textarea");
    textarea.setAttribute("value", null);
    parent.appendChild(textarea);
    }
(divChild));
    (function (parent) {
    var divChild = document.createElement("div");
    divChild.setAttribute("class", "wxHORIZONTAL");
    parent.appendChild(divChild);
    (function (parent) {
    var button = document.createElement("button");
    var textNode = document.createTextNode("MyButton");
    button.appendChild(textNode);
    parent.appendChild(button);
    }
(divChild));
    (function (parent) {
    var button = document.createElement("button");
    var textNode = document.createTextNode("MyButton");
    button.appendChild(textNode);
    parent.appendChild(button);
    }
(divChild));
    }
(divChild));
    (function (parent) {
    var divChild = document.createElement("div");
    divChild.setAttribute("class", "wxHORIZONTAL");
    parent.appendChild(divChild);
    (function (parent) {
    var button = document.createElement("button");
    var textNode = document.createTextNode("MyButton");
    button.appendChild(textNode);
    parent.appendChild(button);
    }
(divChild));
    (function (parent) {
    var button = document.createElement("button");
    var textNode = document.createTextNode("MyButton");
    button.appendChild(textNode);
    parent.appendChild(button);
    }
(divChild));
    }
(divChild));
    }
(divPanel));
    parent.appendChild(divPanel);
    }
(divroot));
    return divroot;
}
());
;
var calIdSelector = document.getElementById("calContent");
calIdSelector.appendChild(calculatorUI);
