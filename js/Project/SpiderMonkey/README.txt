-	search entire solution for BUILDFIX

## 13-Jul-14 ~ michath
1.	Deleted most of the build-release folder except the /dist/include and small 
	files.
2.	Under the filder /shell I added the js.cpp for full functionality inside the
	shell.
	Location: js/src/shell/js.cpp
3.	Deleted all the test folders for jsapi, jit and generic mozilla tests.
	Files were are 40mb. We can store it locally.
4.	Deleted the /gdb folder. I did not find where we used it so far.
5.	Deleted the /editline. A small project to log changes of src inside the 
	SpiderMonkey. To be enabled required a flag we did not used.

-	search entire solution for METADEV

============================================================

additions to reflect.parse object for meta tags

.!, .~
same as UnaryExpression
    type: "UnaryExpression";
    operator: meta_inline | meta_esc;
    prefix: boolean;
    argument: Expression;

.< >.
same as BlockStatement
    type: "MetaQuaziStatement";
    body: [ {
		"type": "BlockStatement",
		"body": [ Statement ]
	} ];


============================================================


function foo2(){ return .< q; z+q; >.; } a = .! .< function foo(){ .~foo2() }; >.;