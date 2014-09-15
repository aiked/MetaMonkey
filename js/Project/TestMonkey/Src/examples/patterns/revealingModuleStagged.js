function genRevealingModuleName(funcDefs) {
    var revealingAst = {loc:null, type:"Program", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"revealingModuleName"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Literal", value:"use strict"}},{loc:null, type:"ReturnStatement", argument:{loc:null, type:"ObjectExpression", properties:[]}}]}, rest:null, generator:false, expression:false}, arguments:[]}}]}]};
for (var i = 0; i < funcDefs.length; ++i) {
    var funcDef = funcDefs[i];
    revealingAst.body[0].declarations[0].init.callee.body.body.splice(1, 0, funcDef.body[0]);
    }
    return revealingAst;
}

(var revealingModuleName = function () {
    "use strict";
    function second() {
    console.log("second");
    }

    function first() {
    console.log("first");
    }

    return {};
}
();
);
