function genSimpleTests() {
    var multi = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:[{loc:null, type:"Literal", value:"meta"}]}},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"x"}, right:{loc:null, type:"ConditionalExpression", test:{loc:null, type:"Identifier", name:"y"}, consequent:{loc:null, type:"Literal", value:1}, alternate:{loc:null, type:"Literal", value:2}}}}]};
    var single = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:[{loc:null, type:"Literal", value:"meta"}]}}]};
    var multiExpr = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"BinaryExpression", operator:"+", left:{loc:null, type:"BinaryExpression", operator:"-", left:{loc:null, type:"Literal", value:1}, right:{loc:null, type:"Literal", value:2}}, right:{loc:null, type:"Literal", value:3}}}]};
    var singleExpr = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"BinaryExpression", operator:"+", left:{loc:null, type:"Identifier", name:"x"}, right:{loc:null, type:"Identifier", name:"y"}}}]};
    var id = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Identifier", name:"x"}}]};
    var duckString = "test duck";
    var duckNum = 1;
    var duckBool = true;
    return [{loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Literal", value:".< 1 + .~multiExpr; + .@duckString >."}}]}, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"BinaryExpression", operator:"+", left:{loc:null, type:"BinaryExpression", operator:"+", left:{loc:null, type:"Literal", value:1}, right:meta_escape( false,multiExpr,false)}, right:meta_escapejsvalue( duckString)}}]}, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Literal", value:".< 2 + .~singleExpr; >."}}]}, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"BinaryExpression", operator:"+", left:{loc:null, type:"Literal", value:2}, right:meta_escape( false,singleExpr,false)}}]}, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Literal", value:".< print(.~multi, 2); >."}}]}, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:meta_escape( true,[{loc:null, type:"Literal", value:2}],[{index:0,expr:multi}],false)}}]}, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Literal", value:".< print(1, .~single); >."}}]}, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:meta_escape( true,[{loc:null, type:"Literal", value:1}],[{index:1,expr:single}],false)}}]}, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Literal", value:".< function foo1(){ print(.@duckNum); .~multi; print(2); }; >."}}]}, {loc:null, type:"Program", body:[{loc:null, type:"FunctionDeclaration", id:{loc:null, type:"Identifier", name:"foo1"}, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:meta_escape( true,[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:[meta_escapejsvalue( duckNum)]}},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:[{loc:null, type:"Literal", value:2}]}}],[{index:1,expr:multi}],true)}, rest:null, generator:false, expression:false},{loc:null, type:"EmptyStatement"}]}, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Literal", value:".< function foo2(){ print(1); .~single; print(2); }; >."}}]}, {loc:null, type:"Program", body:[{loc:null, type:"FunctionDeclaration", id:{loc:null, type:"Identifier", name:"foo2"}, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:meta_escape( true,[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:[{loc:null, type:"Literal", value:1}]}},{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:[{loc:null, type:"Literal", value:2}]}}],[{index:1,expr:single}],true)}, rest:null, generator:false, expression:false},{loc:null, type:"EmptyStatement"}]}, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Literal", value:".< .~multiExpr * .~id * 2 / .~singleExpr - .~multiExpr;  >."}}]}, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"BinaryExpression", operator:"-", left:{loc:null, type:"BinaryExpression", operator:"/", left:{loc:null, type:"BinaryExpression", operator:"*", left:{loc:null, type:"BinaryExpression", operator:"*", left:meta_escape( false,multiExpr,false), right:meta_escape( false,id,false)}, right:{loc:null, type:"Literal", value:2}}, right:meta_escape( false,singleExpr,false)}, right:meta_escape( false,multiExpr,false)}}]}, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Literal", value:".< (.~id)[.~single][.@duckBool]; >."}}]}, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:meta_escape( false,id,false), property:meta_escape( false,single,false), computed:true}, property:meta_escapejsvalue( duckBool), computed:true}}]}, {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"Literal", value:".< if(1).~multi; >."}}]}, {loc:null, type:"Program", body:[{loc:null, type:"IfStatement", test:{loc:null, type:"Literal", value:1}, consequent:meta_escape( false,multi,true), alternate:null}]}];
}

console.log("unit test begin:");
"var multi = .< print('meta'); x = y ? 1 : 2; >.; \tvar single = .< print('meta'); >.; \tvar multiExpr = .< 1 - 2 + 3; >.; \tvar singleExpr = .< x + y; >.; \tvar id = .< x; >.;\tvar duckString = 'test duck';\tvar duckNum = 1;\tvar duckBool = true;";
;
".< 1 + .~multiExpr; + .@duckString >.";
;
1 + (1 - 2 + 3) + "test duck";
;
"__________________";
;
".< 2 + .~singleExpr; >.";
;
2 + (x + y);
;
"__________________";
;
".< print(.~multi, 2); >.";
;
print(print("meta"), x = y?1:2, 2);
;
"__________________";
;
".< print(1, .~single); >.";
;
print(1, print("meta"));
;
"__________________";
;
".< function foo1(){ print(.@duckNum); .~multi; print(2); }; >.";
;
(function foo1() {
    print(1);
    print("meta");
    x = y?1:2;
    print(2);
}

;
);
"__________________";
;
".< function foo2(){ print(1); .~single; print(2); }; >.";
;
(function foo2() {
    print(1);
    print("meta");
    print(2);
}

;
);
"__________________";
;
".< .~multiExpr * .~id * 2 / .~singleExpr - .~multiExpr;  >.";
;
(1 - 2 + 3) * x * 2 / (x + y) - (1 - 2 + 3);
;
"__________________";
;
".< (.~id)[.~single][.@duckBool]; >.";
;
x[print("meta")][true];
;
"__________________";
;
function power(x, n) {
    if (n === 1)
        return x;
        else
        return {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"BinaryExpression", operator:"*", left:meta_escape( false,x,false), right:meta_escape( false,power(x, n - 1),false)}}]};
}

(y - 1) * ((y - 1) * ((y - 1) * ((y - 1) * (y - 1))));
;
