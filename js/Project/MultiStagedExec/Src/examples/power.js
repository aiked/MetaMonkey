.& {
	var gen_power = function( baseAst, exponent ) {
		var resAst = .< .~baseAst; >.;
		for(var i=0; i<exponent; ++i) {
			resAst = .< 
				.~resAst * .~baseAst; 
			>.;
		}
		return resAst;
	};
};

x = Math.random();
y = Math.random();
var rand = .!gen_power( .< x + y; >., 10 );
console.log( rand );