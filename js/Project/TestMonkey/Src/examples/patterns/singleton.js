// (function() {
// 		'use strict';

// 		var instance;

// 		name = function(args) {
// 			if (instance) {
// 				return instance;
// 			}

// 			instance = this;
// 			.~code;
// 			// your code goes here
// 		};

// 		return name;

// 	}())


function genSingleton(code){
	return .<
		(function() {
			'use strict';

			var instance;

			myclass = function(args) {
				if (instance) {
					return instance;
				}

				instance = this;

				.~code;
			};

			return myclass;

		}());
	>.;
}

var myclass = .!genSingleton(
		.< 
			console.log('hello world');
		>.
	);

var class1 = new myclass();
var class2 = new myclass();

console.log( class1 === class2 );