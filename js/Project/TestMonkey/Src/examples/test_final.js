function test() {
    return {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:[]}}]};
}

t(1, print(), 2);
;
