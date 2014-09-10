load("F:\\japostol\\projects\\not\\not\\js\\Project\\TestMonkey\\Src\\GUIGen\\marknote.js");

var calculatorXrc = read("F:\\japostol\\projects\\not\\not\\js\\Project\\TestMonkey\\Src\\GUIGen\\calculator.xrc");


var parser = new marknote.Parser();
var calculatorXml = parser.parse(calculatorXrc);


function power(x, n){
 if(n==1) return x;
	else return .< .~x * .~power(x, n-1); >.;
}

z = .!power(.<x;>., 3);

function foo2(){ return .< q; z; >.; } a = .! .< function foo(){ .~foo2() }; >.;