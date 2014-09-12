
===================RUNNING========================
function foo2() {
    return {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Identifier", name:"q"}},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Identifier", name:"z"}}]};
}

inline( {loc:null, type:"Program", body:[{loc:null, type:"FunctionDeclaration", id:{loc:null, type:"Identifier", name:"foo"}, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[meta_escape( true,[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Identifier", name:"x"}},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Identifier", name:"y"}}],[{index:2,expr:foo2()}],false)]}, rest:null, generator:false, expression:false},{loc:null, type:"EmptyStatement"}]} );
===================RESULT==========================
