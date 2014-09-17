function genMultiParameterOptimizer(argumentsLength) {
    var optimizedAst = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"FunctionExpression", id:null, params:[{loc:null, type:"Identifier", name:"event"},{loc:null, type:"Identifier", name:"args"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"ev"}, init:null},{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"i"}, init:{loc:null, type:"UnaryExpression", operator:"-", argument:{loc:null, type:"Literal", value:1}, prefix:true}}]},{loc:null, type:"SwitchStatement", discriminant:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"args"}, property:{loc:null, type:"Identifier", name:"length"}, computed:false}, cases:[{loc:null, type:"SwitchCase", test:{loc:null, type:"Literal", value:0}, consequent:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"event"}, property:{loc:null, type:"Identifier", name:"callback"}, computed:false}, property:{loc:null, type:"Identifier", name:"call"}, computed:false}, arguments:[{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"ev"}, property:{loc:null, type:"Identifier", name:"ctx"}, computed:false}]}},{loc:null, type:"ReturnStatement", argument:null}]},{loc:null, type:"SwitchCase", test:null, consequent:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"event"}, property:{loc:null, type:"Identifier", name:"callback"}, computed:false}, property:{loc:null, type:"Identifier", name:"apply"}, computed:false}, arguments:[{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"ev"}, property:{loc:null, type:"Identifier", name:"ctx"}, computed:false},{loc:null, type:"Identifier", name:"args"}]}},{loc:null, type:"ReturnStatement", argument:null}]}], lexical:false}]}, rest:null, generator:false, expression:false}}]};
    var switchAst = optimizedAst.body[0].expression.body.body[1];
for (var i = 0; i < argumentsLength; ++i) {
    var newoptimizedFuncall = JSON.parse(JSON.stringify(switchAst.cases[i]));
    var argumentsAst = newoptimizedFuncall.consequent[0].expression.arguments;
    newoptimizedFuncall.test.value = i + 1;
    var argAst = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"args"}, property:meta_escapejsvalue( i), computed:true}}]}.body[0].expression;
    argumentsAst.push(argAst);
    switchAst.cases.splice(i + 1, 0, newoptimizedFuncall);
    }
    return optimizedAst;
}

var triggerEvents = (function (event, args) {
    var ev, i = -1;
    switch (args.length) {
    case 0:
        event.callback.call(ev.ctx);
        return;
    case 1:
        event.callback.call(ev.ctx, args[0]);
        return;
    case 2:
        event.callback.call(ev.ctx, args[0], args[1]);
        return;
    case 3:
        event.callback.call(ev.ctx, args[0], args[1], args[2]);
        return;
    case 4:
        event.callback.call(ev.ctx, args[0], args[1], args[2], args[3]);
        return;
    case 5:
        event.callback.call(ev.ctx, args[0], args[1], args[2], args[3], args[4]);
        return;
    case 6:
        event.callback.call(ev.ctx, args[0], args[1], args[2], args[3], args[4], args[5]);
        return;
    case 7:
        event.callback.call(ev.ctx, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        return;
    case 8:
        event.callback.call(ev.ctx, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
        return;
    case 9:
        event.callback.call(ev.ctx, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
        return;
    case 10:
        event.callback.call(ev.ctx, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
        return;
    default:
        event.callback.apply(ev.ctx, args);
        return;
    }
}
);
;