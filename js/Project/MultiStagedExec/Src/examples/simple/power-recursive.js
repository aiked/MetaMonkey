
.& {
	var gen_power = function( baseAst, exponent ) {
		if(--exponent===0) {
			return baseAst;
		}else {
			return .< 
				.~gen_power(baseAst, exponent) * .~baseAst; 
			>.;
		}
	};
};

x = Math.random();
y = Math.random();
var rand = .!gen_power( .< x + y; >., 4 );
console.log( rand );