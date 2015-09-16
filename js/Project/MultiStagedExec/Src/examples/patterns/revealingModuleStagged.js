function genRevealingModuleName(funcDefs) {
    var revealingAst = {loc:null, type:"Program", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"revealingModuleName"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Literal", value:"use strict"}},{loc:null, type:"ReturnStatement", argument:{loc:null, type:"ObjectExpression", properties:[]}}]}, rest:null, generator:false, expression:false}, arguments:[]}}]}]};
for (var i = 0; i < funcDefs.length; ++i) {
    var funcDef = funcDefs[i];
    var funcBody = revealingAst.body[0].declarations[0].init.callee.body.body;
    funcBody.splice(1, 0, funcDef.body[0]);
    var objTemplate = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"r"}, right:{loc:null, type:"ObjectExpression", properties:[{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"k"}, value:{loc:null, type:"Identifier", name:"v"}, kind:"init"}]}}}]};
    var propertytemplate = objTemplate.body[0].expression.right.properties[0];
    propertytemplate.key = funcDef.body[0].id;
    propertytemplate.value = funcDef.body[0].id;
    funcBody[funcBody.length - 1].argument.properties.push(propertytemplate);
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

    return {first: first,second: second};
}
();
);
