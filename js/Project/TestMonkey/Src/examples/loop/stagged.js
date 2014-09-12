function metaForEach(opts, code) {
    var collectionVar = opts.collection;
    var elementVar = opts.element;
    var indexVar = opts.index;
    var firstLoopVar = opts.firstLoop;
    var lastLoopVar = opts.lastLoop;
    var forAst = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ForInStatement", left:{loc:null, type:"Identifier", name:"k"}, right:meta_escape( collectionVar), body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"v"}, right:{loc:null, type:"MemberExpression", object:meta_escape( collectionVar), property:meta_escape( indexVar), computed:true}}}]}, each:false}, {loc:null, type:"EmptyStatement"}]}, rest:null, generator:false, expression:false}, arguments:[]}}]};
    var funcBody = forAst.body[0].expression.callee.body.body;
    funcBody[0].left = indexVar.body[0].expression;
    funcBody[0].body.body[0].expression.left = elementVar.body[0].expression;
    funcBody[0].body.body = funcBody[0].body.body.concat(code.body);
    var forPosInBody = 0;
    if (firstLoopVar) {
    var firstLoopVarInit = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"v"}, right:{loc:null, type:"Literal", value:true}}}]};
    firstLoopVarInit.body[0].expression.left = firstLoopVar.body[0].expression;
    funcBody.splice(0, 0, firstLoopVarInit.body[0]);
    ++forPosInBody;
    var firstLoopVarfinal = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"v"}, right:{loc:null, type:"Literal", value:false}}}]};
    firstLoopVarfinal.body[0].expression.left = firstLoopVar.body[0].expression;
    funcBody[forPosInBody].body.body.push(firstLoopVarfinal.body[0]);
    }
    if (lastLoopVar) {
    var lastLoopVarInit = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"v"}, right:{loc:null, type:"Literal", value:false}}}]};
    lastLoopVarInit.body[0].expression.left = lastLoopVar.body[0].expression;
    funcBody.splice(0, 0, lastLoopVarInit.body[0]);
    ++forPosInBody;
    var lastLoopVarfinal = {loc:null, type:"Program", body:[{loc:null, type:"IfStatement", test:{loc:null, type:"LogicalExpression", operator:"&&", left:{loc:null, type:"BinaryExpression", operator:"!==", left:{loc:null, type:"UnaryExpression", operator:"typeof", argument:{loc:null, type:"MemberExpression", object:meta_escape( collectionVar), property:{loc:null, type:"Identifier", name:"length"}, computed:false}, prefix:true}, right:{loc:null, type:"Literal", value:"undefined"}}, right:{loc:null, type:"BinaryExpression", operator:"==", left:meta_escape( indexVar), right:{loc:null, type:"BinaryExpression", operator:"-", left:{loc:null, type:"MemberExpression", object:meta_escape( collectionVar), property:{loc:null, type:"Identifier", name:"length"}, computed:false}, right:{loc:null, type:"Literal", value:1}}}}, consequent:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"v"}, right:{loc:null, type:"Literal", value:true}}}]}, alternate:null}, {loc:null, type:"EmptyStatement"}]};
    lastLoopVarfinal.body[0].consequent.body[0].expression.left = lastLoopVarInit.body[0].expression.left;
    funcBody[forPosInBody].body.body.splice(0, 0, lastLoopVarfinal.body[0]);
    }
    return forAst;
}

var fruits = ["ananas", "aple", "lemon", "banana"];
var msg = "";
(function () {
    last = false;
    first = true;
    for (i in fruits) {
    if (typeof fruits.length !== "undefined" && i == fruits.length - 1) {
    last = true;
    }
    fruit = fruits[i];
    if (first) {
    msg += "i like very much " + fruit + ", ";
    } else
        if (last) {
    msg += "but i hate " + fruit;
        } else {
    msg += "i eat " + fruit + ", ";
        }
    first = false;
    }
    ;
}
());
;
print(msg);
