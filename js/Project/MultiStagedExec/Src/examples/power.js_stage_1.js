 {
    var gen_power = function (baseAst, exponent) {
    var resAst = {loc:{start:{line:3, column:15}, end:{line:3, column:28}, source:null}, type:"Program", body:meta_escape( true,[],[{index:0,expr:baseAst}],true)};
for (var i = 0; i < exponent; ++i) {
    resAst = {loc:{start:{line:5, column:12}, end:{line:6, column:25}, source:null}, type:"Program", body:[{loc:{start:{line:6, column:4}, end:{line:6, column:25}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:6, column:4}, end:{line:6, column:24}, source:null}, type:"BinaryExpression", operator:"*", left:meta_escape( false,resAst,false), right:meta_escape( false,baseAst,false)}}]};
    }
    return resAst;
}
;
}
inline( gen_power({loc:{start:{line:15, column:24}, end:{line:15, column:33}, source:null}, type:"Program", body:[{loc:{start:{line:15, column:27}, end:{line:15, column:33}, source:null}, type:"ExpressionStatement", expression:{loc:{start:{line:15, column:27}, end:{line:15, column:32}, source:null}, type:"BinaryExpression", operator:"+", left:{loc:{start:{line:15, column:27}, end:{line:15, column:28}, source:null}, type:"Identifier", name:"x"}, right:{loc:{start:{line:15, column:31}, end:{line:15, column:32}, source:null}, type:"Identifier", name:"y"}}}]}, 10) );