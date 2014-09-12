function minify(codeFilename) {
    load("Src\\examples\\minifier\\fulljsmin.js");
    var file = read(codeFilename);
    var minifiedFile = jsmin("minified code", file, 2);
    var minifiedFileAst = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"eval"}, arguments:[{loc:null, type:"Literal", value:""}]}}]};
    minifiedFileAst.body[0].expression.arguments[0].value = minifiedFile;
    return minifiedFileAst;
}

var fakevar = 1;
if (fakevar === 2)
    fakevar = 3;
eval("minified code\n\nfunction getBuildMode(){return'release';}\nfunction assert(cond,msg){var buildMode=getBuildMode();if(buildMode==='debug'){return.<console.assert(.~cond,.~msg);>.;}else{return.<if(.~cond){alert(\"oops!, an error occurred!, \"+.~msg+\", pleaze contact us.\");};>.;}}\nvar handlers={plus:function(x,y){return x+y;},minus:function(x,y){return x-y;},call:function(funcName){var fun=this[funcName];.!assert(.<fun;>.,.<'cannot find ('+funcName+') method';>.);return fun.apply(this,arguments);}}\nhandlers.call('plus',1,2);");
;
var fakevar = 1;
if (fakevar === 2)
    fakevar = 3;
