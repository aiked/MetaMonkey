function xmlToAst(xrcFileName, handlers) {
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
    actionAst = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"elem"}, property:{loc:null, type:"Literal", value:""}, computed:true}, right:meta_escape( false,handler.action,false)}}]};
    actionAst.body[0].expression.left.property.value = handler.evt;
    } else {
    actionAst = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:meta_escape( false,handler.action,false), arguments:[{loc:null, type:"Identifier", name:"elem"}]}}]};
    }
    root.splice(root.length - 2, 0, Ast_esc(actionAst, true));
    }
    }

    load("Src\\examples\\GUIGen\\xparse.js");
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
    var retVal = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"parent"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"divChild"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"div"}]}}]},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"divChild"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"class"},{loc:null, type:"Literal", value:""}]}},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"parent"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:null, type:"Identifier", name:"divChild"}]}}]}, rest:null, generator:false, expression:false}, arguments:meta_escape( true,[],[{index:0,expr:parent}],false)}}]};
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
    var retVal = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"parent"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"elem"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"textarea"}]}}]},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"elem"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"id"},{loc:null, type:"Literal", value:""}]}},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"elem"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"value"},{loc:null, type:"Literal", value:""}]}},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"elem"}, property:{loc:null, type:"Identifier", name:"readOnly"}, computed:false}, right:{loc:null, type:"Literal", value:true}}},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"parent"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:null, type:"Identifier", name:"elem"}]}}]}, rest:null, generator:false, expression:false}, arguments:meta_escape( true,[],[{index:0,expr:parent}],false)}}]};
    var retValBody = Ast_GetBody(retVal);
    retValBody[1].expression.arguments[1].value = id;
    retValBody[2].expression.arguments[1].value = getElemValue(value);
    Ast_appendHandlerToBody(retValBody, handlers, id);
    return retVal;
}
,wxButton: function (obj, parent) {
    var label = getElemByName(obj, "label");
    var id = getAttrByName(obj, "name");
    var retVal = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"parent"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"elem"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"button"}]}}]},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"elem"}, property:{loc:null, type:"Identifier", name:"setAttribute"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"id"},{loc:null, type:"Literal", value:""}]}},{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"textNode"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createTextNode"}, computed:false}, arguments:[{loc:null, type:"Literal", value:""}]}}]},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"elem"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:null, type:"Identifier", name:"textNode"}]}},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"parent"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:null, type:"Identifier", name:"elem"}]}}]}, rest:null, generator:false, expression:false}, arguments:meta_escape( true,[],[{index:0,expr:parent}],false)}}]};
    var retValBody = Ast_GetBody(retVal);
    retValBody[1].expression.arguments[1].value = id;
    retValBody[2].declarations[0].init.arguments[0].value = getElemValue(label);
    Ast_appendHandlerToBody(retValBody, handlers, id);
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
    return {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"parent"}], defaults:[], body:{loc:null, type:"BlockStatement", body:meta_escape( true,[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"divPanel"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"div"}]}}]},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"parent"}, property:{loc:null, type:"Identifier", name:"appendChild"}, computed:false}, arguments:[{loc:null, type:"Identifier", name:"divPanel"}]}}],[{index:1,expr:this.parseItems.callParser(object, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Identifier", name:"divPanel"}}]})}],true)}, rest:null, generator:false, expression:false}, arguments:meta_escape( true,[],[{index:0,expr:parent}],false)}}]};
}
,startParser: function (obj) {
    return {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:meta_escape( true,[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"divroot"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"document"}, property:{loc:null, type:"Identifier", name:"createElement"}, computed:false}, arguments:[{loc:null, type:"Literal", value:"div"}]}}]},{loc:null, type:"ReturnStatement", argument:{loc:null, type:"Identifier", name:"divroot"}}],[{index:1,expr:this.parsePanel(obj, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Identifier", name:"divroot"}}]})}],true)}, rest:null, generator:false, expression:false}, arguments:[]}}]};
}
};
    return xrcToAst.startParser(panelObj);
}

var calculatorLogic = {textArea: null};
function generateNumberHandlers(handlers) {
for (var i = 0; i < 10; ++i) {
    var astprops = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"ObjectExpression", properties:[{loc:null, type:"Property", key:{loc:null, type:"Literal", value:"k"}, value:{loc:null, type:"ObjectExpression", properties:[{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"evt"}, value:{loc:null, type:"Literal", value:"onclick"}, kind:"init"},{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"action"}, value:{loc:null, type:"MetaQuaziStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:""}}}]}, rest:null, generator:false, expression:false}}]}, kind:"init"}]}, kind:"init"}]}}]};
    var astprop = astprops.body[0].expression.properties[0];
    astprop.key.value = "c_" + i;
    astprop.value.properties[1].value.body[0].expression.body.body[0].expression.right.value = i + "";
    handlers.body[0].expression.properties.push(astprop);
    }
}

function getHandlers() {
    var handlers = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"ObjectExpression", properties:[{loc:null, type:"Property", key:{loc:null, type:"Literal", value:"c_clear"}, value:{loc:null, type:"ObjectExpression", properties:[{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"evt"}, value:{loc:null, type:"Literal", value:"onclick"}, kind:"init"},{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"action"}, value:{loc:null, type:"MetaQuaziStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"elem"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:""}}}]}, rest:null, generator:false, expression:false}}]}, kind:"init"}]}, kind:"init"},{loc:null, type:"Property", key:{loc:null, type:"Literal", value:"c_input"}, value:{loc:null, type:"ObjectExpression", properties:[{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"action"}, value:{loc:null, type:"MetaQuaziStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"elem"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, right:{loc:null, type:"Identifier", name:"elem"}}}]}, rest:null, generator:false, expression:false}}]}, kind:"init"}]}, kind:"init"},{loc:null, type:"Property", key:{loc:null, type:"Literal", value:"c_plus"}, value:{loc:null, type:"ObjectExpression", properties:[{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"evt"}, value:{loc:null, type:"Literal", value:"onclick"}, kind:"init"},{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"action"}, value:{loc:null, type:"MetaQuaziStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"+"}}}]}, rest:null, generator:false, expression:false}}]}, kind:"init"}]}, kind:"init"},{loc:null, type:"Property", key:{loc:null, type:"Literal", value:"c_minus"}, value:{loc:null, type:"ObjectExpression", properties:[{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"evt"}, value:{loc:null, type:"Literal", value:"onclick"}, kind:"init"},{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"action"}, value:{loc:null, type:"MetaQuaziStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"-"}}}]}, rest:null, generator:false, expression:false}}]}, kind:"init"}]}, kind:"init"},{loc:null, type:"Property", key:{loc:null, type:"Literal", value:"c_multi"}, value:{loc:null, type:"ObjectExpression", properties:[{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"evt"}, value:{loc:null, type:"Literal", value:"onclick"}, kind:"init"},{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"action"}, value:{loc:null, type:"MetaQuaziStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"*"}}}]}, rest:null, generator:false, expression:false}}]}, kind:"init"}]}, kind:"init"},{loc:null, type:"Property", key:{loc:null, type:"Literal", value:"c_div"}, value:{loc:null, type:"ObjectExpression", properties:[{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"evt"}, value:{loc:null, type:"Literal", value:"onclick"}, kind:"init"},{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"action"}, value:{loc:null, type:"MetaQuaziStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"/"}}}]}, rest:null, generator:false, expression:false}}]}, kind:"init"}]}, kind:"init"},{loc:null, type:"Property", key:{loc:null, type:"Literal", value:"c_result"}, value:{loc:null, type:"ObjectExpression", properties:[{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"evt"}, value:{loc:null, type:"Literal", value:"onclick"}, kind:"init"},{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"action"}, value:{loc:null, type:"MetaQuaziStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"result"}, init:null}]},{loc:null, type:"TryStatement", block:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"result"}, right:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"eval"}, arguments:[{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}]}}}]}, guardedHandlers:[], handler:{loc:null, type:"CatchClause", param:{loc:null, type:"Identifier", name:"e"}, guard:null, body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"result"}, right:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"Error"}}}}]}}, finalizer:null},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"BinaryExpression", operator:"+", left:{loc:null, type:"Literal", value:" = "}, right:{loc:null, type:"Identifier", name:"result"}}}}]}, rest:null, generator:false, expression:false}}]}, kind:"init"}]}, kind:"init"}]}}]};
    generateNumberHandlers(handlers);
    return handlers;
}

function generateHandlers() {
    return ({"c_clear": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"elem"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:""}}}]}, rest:null, generator:false, expression:false}}]}},"c_input": {action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"elem"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, right:{loc:null, type:"Identifier", name:"elem"}}}]}, rest:null, generator:false, expression:false}}]}},"c_plus": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"+"}}}]}, rest:null, generator:false, expression:false}}]}},"c_minus": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"-"}}}]}, rest:null, generator:false, expression:false}}]}},"c_multi": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"*"}}}]}, rest:null, generator:false, expression:false}}]}},"c_div": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"/"}}}]}, rest:null, generator:false, expression:false}}]}},"c_result": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"result"}, init:null}]},{loc:null, type:"TryStatement", block:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"result"}, right:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"eval"}, arguments:[{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}]}}}]}, guardedHandlers:[], handler:{loc:null, type:"CatchClause", param:{loc:null, type:"Identifier", name:"e"}, guard:null, body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"result"}, right:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"Error"}}}}]}}, finalizer:null},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"BinaryExpression", operator:"+", left:{loc:null, type:"Literal", value:" = "}, right:{loc:null, type:"Identifier", name:"result"}}}}]}, rest:null, generator:false, expression:false}}]}},"c_0": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"0"}}}]}, rest:null, generator:false, expression:false}}]}},"c_1": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"1"}}}]}, rest:null, generator:false, expression:false}}]}},"c_2": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"2"}}}]}, rest:null, generator:false, expression:false}}]}},"c_3": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"3"}}}]}, rest:null, generator:false, expression:false}}]}},"c_4": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"4"}}}]}, rest:null, generator:false, expression:false}}]}},"c_5": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"5"}}}]}, rest:null, generator:false, expression:false}}]}},"c_6": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"6"}}}]}, rest:null, generator:false, expression:false}}]}},"c_7": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"7"}}}]}, rest:null, generator:false, expression:false}}]}},"c_8": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"8"}}}]}, rest:null, generator:false, expression:false}}]}},"c_9": {evt: "onclick",action: {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"calculatorLogic"}, property:{loc:null, type:"Identifier", name:"textArea"}, computed:false}, property:{loc:null, type:"Identifier", name:"value"}, computed:false}, right:{loc:null, type:"Literal", value:"9"}}}]}, rest:null, generator:false, expression:false}}]}}});
;
}

var calculatorUI = (function () {
    var divroot = document.createElement("div");
    (function (parent) {
    var divPanel = document.createElement("div");
    (function (parent) {
    var divChild = document.createElement("div");
    divChild.setAttribute("class", "c-col");
    parent.appendChild(divChild);
    (function (parent) {
    var elem = document.createElement("textarea");
    elem.setAttribute("id", "c_input");
    elem.setAttribute("value", null);
    (function (elem) {
    calculatorLogic.textArea = elem;
    }
(elem));
    elem.readOnly = true;
    parent.appendChild(elem);
    }
(divChild));
    (function (parent) {
    var divChild = document.createElement("div");
    divChild.setAttribute("class", "c-row");
    parent.appendChild(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_1");
    var textNode = document.createTextNode("1");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "1";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
(divChild));
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_2");
    var textNode = document.createTextNode("2");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "2";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
(divChild));
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_3");
    var textNode = document.createTextNode("3");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "3";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
(divChild));
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_clear");
    var textNode = document.createTextNode("C");
    elem["onclick"] = function (elem) {
    calculatorLogic.textArea.value = "";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
(divChild));
    }
(divChild));
    (function (parent) {
    var divChild = document.createElement("div");
    divChild.setAttribute("class", "c-row");
    parent.appendChild(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_4");
    var textNode = document.createTextNode("4");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "4";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
(divChild));
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_5");
    var textNode = document.createTextNode("5");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "5";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
(divChild));
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_6");
    var textNode = document.createTextNode("6");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "6";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
(divChild));
    }
(divChild));
    (function (parent) {
    var divChild = document.createElement("div");
    divChild.setAttribute("class", "c-row");
    parent.appendChild(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_7");
    var textNode = document.createTextNode("7");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "7";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
(divChild));
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_8");
    var textNode = document.createTextNode("8");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "8";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
(divChild));
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_9");
    var textNode = document.createTextNode("9");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "9";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
(divChild));
    }
(divChild));
    (function (parent) {
    var divChild = document.createElement("div");
    divChild.setAttribute("class", "c-row");
    parent.appendChild(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_plus");
    var textNode = document.createTextNode("+");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "+";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
(divChild));
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_minus");
    var textNode = document.createTextNode("-");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "-";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
(divChild));
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_multi");
    var textNode = document.createTextNode("*");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "*";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
(divChild));
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_div");
    var textNode = document.createTextNode("/");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "/";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
(divChild));
    }
(divChild));
    (function (parent) {
    var divChild = document.createElement("div");
    divChild.setAttribute("class", "c-row");
    parent.appendChild(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_result");
    var textNode = document.createTextNode("=");
    elem["onclick"] = function () {
    var result;
    try {
    result = eval(calculatorLogic.textArea.value);
    } catch (e) {
    result = calculatorLogic.textArea.value = "Error";
    }
    calculatorLogic.textArea.value += " = " + result;
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
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