var STG_NotSupposed = function() {
	throw new Error( 'spidermonkey staged browser ' +
		'debugger, not supposed client function' );
};

window.version = function() {
	return 'spidermonkey staged browser debugger';
};

window.options = STG_NotSupposed;

var RetriveFromServerSync = function( path, error, done ) {
	if( !$ || $( 'html' ).length === undefined ) 
		STG_NotSupposed();

	path = '\\' + path;
	var ajaxOpts = {
	    type: 			'GET',
	    url: 			path,
	    async: 			false,
	    cache: 			false,
	    dataType: 		'text',

	    success: done,
	    error: 	error
	};
	$.ajax( ajaxOpts );
};

window.load = function( path ) {
	RetriveFromServerSync( path, function() {
		throw new Error( 'cannot load: ' + path ); 
	}, function( resp ) {
		eval( resp );
	} );
};

window.loadRelativeToScript = STG_NotSupposed;

window.evaluate = function( code ) { return eval(code); };

window.run = STG_NotSupposed;

window.readline = STG_NotSupposed;

window.print = function(){ console.log.apply( console, arguments ) };

window.printErr = function(){ console.error.apply( console, arguments ) };

window.putstr = STG_NotSupposed;

window.dateNow = function() { return ( new Date ).getTime(); };

window.help = STG_NotSupposed;

window.quit = STG_NotSupposed;

window.assertEq = function( actual, expected, msg ) { 
	if( actual !== expected ) {
		throw new Error( msg || '' );
	}
};

window.setDebug = STG_NotSupposed;

window.setDebuggerHandler = STG_NotSupposed;

window.throwError = function( msg ) { 
	throw new Error( msg || '' );
};

window.dumpObject = STG_NotSupposed;

window.disassemble = STG_NotSupposed;

window.dis = STG_NotSupposed;

window.disfile = STG_NotSupposed;

window.dissrc = STG_NotSupposed;

window.dumpHeap = STG_NotSupposed;

window.notes = STG_NotSupposed;

window.findReferences = STG_NotSupposed;

window.build = STG_NotSupposed;

window.intern = STG_NotSupposed;

window.clone = STG_NotSupposed;

window.getpda = STG_NotSupposed;

window.getslx = STG_NotSupposed;

window.toint32 = STG_NotSupposed;

window.evalcx = STG_NotSupposed;

window.evalInFrame = STG_NotSupposed;

window.shapeOf = STG_NotSupposed;

window.resolver = STG_NotSupposed;

window.arrayInfo = STG_NotSupposed;

window.snarf = STG_NotSupposed;

window.read = function( path ) {
	var loadResp;
	RetriveFromServerSync( path, function() {
		throw new Error( 'cannot load: ' + path ); 
	}, function( resp ) {
		if( typeof resp !== 'string' ) {
			resp = JSON.stringify( resp );
		}
		loadResp = resp;
	} );
	return loadResp;
};

window.readRelativeToScript = STG_NotSupposed;

window.compile = STG_NotSupposed;

window.parse = STG_NotSupposed;

window.syntaxParse = STG_NotSupposed;

window.timeout = STG_NotSupposed;

window.elapsed = STG_NotSupposed;

window.decompileFunction = STG_NotSupposed;

window.decompileBody = STG_NotSupposed;

window.decompileThis = STG_NotSupposed;

window.thisFilename = STG_NotSupposed;

window.wrap = STG_NotSupposed;

window.wrapWithProto = STG_NotSupposed;

window.serialize = STG_NotSupposed;

window.deserialize = STG_NotSupposed;

window.newGlobal = STG_NotSupposed;

window.enableStackWalkingAssertion = STG_NotSupposed;

window.getMaxArgs = STG_NotSupposed;

window.getSelfHostedValue = STG_NotSupposed;

window.parent = STG_NotSupposed;

window.line2pc = STG_NotSupposed;

window.pc2line = STG_NotSupposed;

window.setThrowHook = STG_NotSupposed;

window.system = STG_NotSupposed;

window.trap = STG_NotSupposed;

window.unparse = STG_NotSupposed;

window.untrap = STG_NotSupposed;