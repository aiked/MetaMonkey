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


function genSingleton(funDef){
	return .<
		(function() {
			'use strict';

			var instance;

			myclass = function() {
				if (instance) {
					return instance;
				}

				instance = this;
				(.~funDef).apply(this, arguments);
			};

			return myclass;

		}());
	>.;
}

var myclass = .!genSingleton(
		function(name) {
			this.name = name;
			console.log(this.name);
		}
	);

var class1 = new myclass('class1');
var class2 = new myclass('class2');

console.log( class1 === class2 );