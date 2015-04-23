
.& {
	function getBuildMode(){
		return 'release'; //debug
	}

	function assert(cond, msg){
		var buildMode =  getBuildMode();
		if(buildMode === 'debug'){
			return .< console.assert(.~cond, .~msg); >.;
		}else{
			return .< 
				if(.~cond){
					alert("oops!, an error occurred!, " + .~msg + ", pleaze contact us.");
				};
			>.;
		}
	}
}


var handlers = {
	plus: function(x, y){
		return x + y;
	},
	minus: function(x, y){
		return x - y;
	},

	call: function(funcName){
		var fun = this[funcName];
		.!assert( .<fun;>., .<'cannot find (' + funcName + ') method';>. );
		return fun.apply(this, arguments);
	}
}

handlers.call( 'plus', 1, 2 );