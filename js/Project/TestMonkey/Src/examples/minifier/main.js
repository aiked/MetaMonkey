function minify(codeFilename){
  load("Src\\examples\\minifier\\fulljsmin.js");
  var file = read(codeFilename);
  var minifiedFile = jsmin("", file, 2);
  var minifiedFileAst = .< eval(""); >.;
  minifiedFileAst.body[0].expression.arguments[0].value = minifiedFile;
  return minifiedFileAst;
}



var fakevar = 1;
if(fakevar===2)
  fakevar=3;

//////////// performance critical code

.!minify("Src\\examples\\minifier\\logic.js");

///////////////////////////////////////

var fakevar = 1;
if(fakevar===2)
  fakevar=3;


