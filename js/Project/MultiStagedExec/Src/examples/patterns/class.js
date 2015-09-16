// var point = (function(){

// 	var x=1;
// 	var y=2;

// 	function getSum(){
// 		return this.x;
// 	}

// 	function toStringSum(){
// 		return getSum();
// 	}

// 	return {
// 		toStringSum: toStringSum
// 	}

// })( )



function genClass( className, fields ){

	var classAst = .< 

		var className = (function(){

			return {
				init: function(){
					.~fields.init;
				}
			};

		})();

	>.;

	classAst.body[0].declarations[0].id.name = className;

	function AppendField( field, classAst ){
		var funcBody = classAst.body[0].declarations[0].init.callee.body.body;
		funcBody.splice(0, 0, field.body[0]);
	}


	if(fields.private) {
		for(var i=0; i<fields.private.length; ++i){
			AppendField( fields.private[i], classAst );
		}	
	}

	if(fields.public) {
		for(var i=0; i<fields.public.length; ++i){
			var field = fields.public[i];
			AppendField( field, classAst );

			var funcBody = classAst.body[0].declarations[0].init.callee.body.body;

			var objTemplate =  .< r = {k: v}; >.;
			var propertytemplate = objTemplate.body[0].expression.right.properties[0];
			propertytemplate.key = field.body[0].id;
			propertytemplate.value = field.body[0].id;

			funcBody[funcBody.length-1].argument.properties.push(propertytemplate);
		}	
	}

	return classAst;
}


.!genClass(
		"point",
		{
			private: [
				.< var x; >.,
				.< var y; >.,
				.< function getSum(){ return x + y; }; >.
			],

			public: [
				.< function getStringSum(){ return getSum() + ""; }; >.
			],

			init: .<
				x = 1;
				y = 2;
			>.
		}
	);


function genClass(mdl) {
	function getName( attr ){
		return attr.type === 'variableDeclaration' ?
		attr.declarations[0].id : attr.id
	}
	var modules = .<>.;
	for(var i=0; i<mdl.prvAst.length; ++i) {
		modules = .< .~modules; .~mdl.prvAst[i]; >.;
	}
	var exposed = .<>.;
	for(var i=0; i<mdl.pubAst.length; ++i) {
		modules = .< .~modules; .~mdl.pubAst[i]; >.;
		var name = getName(mdl.pubAst[i]);
		exposed = .< .~exposed; expObj[.@name] = .@name; >.;
	}
	return .< 
		(function(){
			.~modules;
			return (function(){
				var exprObj = {};
				.~exposed;
				return exprObj;
			})();
		});
	>.
};

.!genClass(

);