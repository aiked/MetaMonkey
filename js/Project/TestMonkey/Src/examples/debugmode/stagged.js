function getBuildMode() {
    return "release";
}

function assert(cond, msg) {
    var buildMode = getBuildMode();
    if (buildMode === "debug") {
    return {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"console"}, property:{loc:null, type:"Identifier", name:"assert"}, computed:false}, arguments:[meta_escape( cond), meta_escape( msg)]}}]};
    } else {
    return {loc:null, type:"Program", body:[{loc:null, type:"IfStatement", test:meta_escape( cond), consequent:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"alert"}, arguments:[{loc:null, type:"BinaryExpression", operator:"+", left:{loc:null, type:"BinaryExpression", operator:"+", left:{loc:null, type:"Literal", value:"oops!, an error occurred!, "}, right:meta_escape( msg)}, right:{loc:null, type:"Literal", value:", pleaze contact us."}}]}}]}, alternate:null}, {loc:null, type:"EmptyStatement"}]};
    }
}

var handlers = {plus: function (x, y) {
    return (x + y);
}
,minus: function (x, y) {
    return (x - y);
}
,call: function (funcName) {
    var fun = this[funcName];
    if (fun) {
    alert("oops!, an error occurred!, " + ("cannot find (" + funcName + ") method") + ", pleaze contact us.");
}
;
;
    return fun.apply(this, arguments);
}
};
handlers.call("plus", 1, 2);
