// var functionName = (function() {
// 	'use strict';

// 	var funcMemoized = function() {
// 		var cacheKey = JSON.stringify(Array.prototype.slice.call(arguments));
// 		var result;

// 		if (!funcMemoized.cache[cacheKey]) {
// 				// your expensive computation goes here
// 				// to reference the paramaters passed, use arguments[n]
// 				// eg.: result = arguments[0] + arguments[1];
// 				funcMemoized.cache[cacheKey] = result;
// 		}

// 		return funcMemoized.cache[cacheKey];
// 	};

// 	funcMemoized.cache = {};

// 	return funcMemoized;
// }());



function memoized(funDef){
	return .<
		(function(funDef) {
			var funcMemoized = function() {
				var result, cacheKey = 
					JSON.stringify(Array.prototype.slice.call(arguments));

				if (!funcMemoized.cache[cacheKey]) {
					result = (funDef).apply(null, arguments)
					funcMemoized.cache[cacheKey] = result;
				}
				return funcMemoized.cache[cacheKey];
			};
			funcMemoized.cache = {};
			return funcMemoized;
		}(.~funDef));
	>.;
}



function cos(x){
	return Math.cos(x);
}

cos = .!memoized(.<cos;>.);
