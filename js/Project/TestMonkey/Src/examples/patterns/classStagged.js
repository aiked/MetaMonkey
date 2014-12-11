function genClass(className, fields) {
    var classAst = {loc:null, type:"Program", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"className"}, init:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ReturnStatement", argument:{loc:null, type:"ObjectExpression", properties:[{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"init"}, value:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:meta_escape( true,[],[{index:0,expr:fields.init}],true)}, rest:null, generator:false, expression:false}, kind:"init"}]}}]}, rest:null, generator:false, expression:false}, arguments:[]}}]}]};
    classAst.body[0].declarations[0].id.name = className;
    function AppendField(field, classAst) {
    var funcBody = classAst.body[0].declarations[0].init.callee.body.body;
    funcBody.splice(0, 0, field.body[0]);
    }

for (var i = 0; i < fields.private.length; ++i) {
    AppendField(fields.private[i], classAst);
    }
for (var i = 0; i < fields.public.length; ++i) {
    var field = fields.public[i];
    AppendField(field, classAst);
    var funcBody = classAst.body[0].declarations[0].init.callee.body.body;
    var objTemplate = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"r"}, right:{loc:null, type:"ObjectExpression", properties:[{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"k"}, value:{loc:null, type:"Identifier", name:"v"}, kind:"init"}]}}}]};
    var propertytemplate = objTemplate.body[0].expression.right.properties[0];
    propertytemplate.key = field.body[0].id;
    propertytemplate.value = field.body[0].id;
    funcBody[funcBody.length - 1].argument.properties.push(propertytemplate);
    }
    return classAst;
}

(var point = function () {
    function getStringSum() {
    return (getSum() + "");
    }

    function getSum() {
    return (x + y);
    }

    var y;
    var x;
    return {init: function () {
    x = 1;
    y = 2;
    }
,getStringSum: getStringSum};
}
();
);
