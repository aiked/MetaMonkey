function foo2() {
    return {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Identifier", name:"q"}},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"BinaryExpression", operator:"+", left:{loc:null, type:"Identifier", name:"z"}, right:{loc:null, type:"Identifier", name:"q"}}}]};
}

x = meta_escfoo2();
