// var revealingModuleName = (function() {
// 	'use strict';

// 	function methodName() {
		
// 	}

// 	return {
// 		methodName:methodName
// 	};

// }());

function genRevealingModuleName(funcDefs){
	var revealingAst = .<
		var revealingModuleName = (function() {
			'use strict';

			return {};

		}());
	>.;

	for(var i=0; i<funcDefs.length; ++i){
		var funcDef = funcDefs[i];
		var funcBody = revealingAst.body[0].declarations[0].init.callee.body.body;
		funcBody.splice(1, 0, funcDef.body[0]);
		//var retuObj = funcBody[funcBody.length-1].argument.properties

	}

	return revealingAst;
}


.!genRevealingModuleName([
		.< 
			function first(){
				console.log('first');
			};
		>.,
		.< 
			function second(){
				console.log('second');
			};
		>.
	]);
