var functionName = (function() {
	'use strict';

	var funcMemoized = function() {
		var cacheKey = JSON.stringify(Array.prototype.slice.call(arguments));
		var result;

		if (!funcMemoized.cache[cacheKey]) {
				// your expensive computation goes here
				// to reference the paramaters passed, use arguments[n]
				// eg.: result = arguments[0] + arguments[1];
				funcMemoized.cache[cacheKey] = result;
		}

		return funcMemoized.cache[cacheKey];
	};

	funcMemoized.cache = {};

	return funcMemoized;
}());

var time = mycos(1);
function mycos(num){
	
}

function memoized(funDef){
	return .<
		(function() {
			'use strict';

			var funcMemoized = function() {
				var cacheKey = JSON.stringify(Array.prototype.slice.call(arguments));
				var result;

				if (!funcMemoized.cache[cacheKey]) {
						result = funDef.apply(null, arguments)
						funcMemoized.cache[cacheKey] = result;
				}

				return funcMemoized.cache[cacheKey];
			};

			funcMemoized.cache = {};

			return funcMemoized;
		}());
	>.;
}


var mycos = .!memoized(
		.< 
			function mycos(num){
		
			}
		>.
	);



function genSingleton(code){}
	return .< (function() {
		'use strict';

		var instance;

		name = function(args) {
			if (instance) {
				return instance;
			}

			instance = this;
			.~code;
			// your code goes here
		};

		return name;

	}());
	>.;
}


var singleton = .!genSingleton(
		.< 
			function body...
		>.
	);



var revealingModuleName = (function() {
	'use strict';

	function methodName() {
		
	}

	return {
		methodName:methodName
	};

}());


