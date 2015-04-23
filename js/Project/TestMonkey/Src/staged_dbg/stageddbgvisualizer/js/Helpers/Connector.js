define( 
[

],

function() {

	var SERVER_IP = 'http://localhost:8085';

	var serverRoutes = {
		SYNC: 	{
			type: 		'POST',
			url: 		'syncdbg'
		}
	};

	var send = function( routeId, opts ) {
		var routeInf = serverRoutes[ routeId ];
		var ajaxOpts = {
            type: 			routeInf.type,
            url: 			SERVER_IP + '/' + routeInf.url,
            cache: 			false,
            data: 			opts.data,
            dataType: 		'json',
            contentType: 	'application/json',

            success: function( resp ) { 
            	return opts.success( resp.msg );
            },
            error: 	function( resp ) {	
            	console.log( 'fail' );
            	console.log( resp );
            	return opts.fail( resp );
            }
        };
        $.ajax( ajaxOpts );
	};

	return {
		send: send
	};

}
);