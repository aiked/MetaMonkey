function metaForEach(opts, code){
	var collectionVar = opts.collection;
	var elementVar = opts.element;
	var indexVar = opts.index;
	var firstLoopVar = opts.firstLoop;
	var lastLoopVar = opts.lastLoop;

	var forAst = .<
			(function(){
				
				for(k in .~collectionVar ){
					v = (.~collectionVar)[ .~indexVar  ];
				};
			})();
		>.;

	var funcBody = forAst.body[0].expression.callee.body.body;
	funcBody[0].left = indexVar.body[0].expression;
	funcBody[0].body.body[0].expression.left = elementVar.body[0].expression;
	funcBody[0].body.body = funcBody[0].body.body.concat( code.body );

	var forPosInBody = 0;
	if(firstLoopVar){
		var firstLoopVarInit = .< v = true; >.;
		firstLoopVarInit.body[0].expression.left = firstLoopVar.body[0].expression;

		funcBody.splice(0, 0, firstLoopVarInit.body[0]);
		++forPosInBody;

		var firstLoopVarfinal = .< v = false; >.;
		firstLoopVarfinal.body[0].expression.left = firstLoopVar.body[0].expression;

		funcBody[forPosInBody].body.body.push(firstLoopVarfinal.body[0]);
	}

	if(lastLoopVar){
		var lastLoopVarInit = .< v = false; >.;
		lastLoopVarInit.body[0].expression.left = lastLoopVar.body[0].expression;

		funcBody.splice(0, 0, lastLoopVarInit.body[0]);
		++forPosInBody;

		var lastLoopVarfinal = .< 
				if( typeof (.~collectionVar).length !== 'undefined' && .~indexVar==(.~collectionVar).length-1){
					v = true;
				};
			>.;
		lastLoopVarfinal.body[0].consequent.body[0].expression.left = lastLoopVarInit.body[0].expression.left;

		funcBody[forPosInBody].body.body.splice(0, 0, lastLoopVarfinal.body[0]);	
	}

	return forAst;
}



var fruits = ['pineaple', 'aple', 'lemon', 'banana'];

var msg = "";

.!metaForEach(
		{ 
			collection: .< fruits; >., 
			element: .< fruit; >., 
			index: .< i; >., 
			lastLoop: .< last; >., 
			firstLoop: .< first; >. 
		},
		.< 
			if( first ){
				msg += 'i like very much ' + fruit + ', ';
			}else if( last ){
				msg += 'but i hate ' + fruit;
			}else{
				msg += 'i eat ' + fruit + ', ';
			}
		>.
	);

print(msg);