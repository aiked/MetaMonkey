// stagedlib.js
// Library for debugging spidermonkey staged code 
// Giannis Apostolidis
// March 2015.
//


( function(global) {

	var STG_Opts = 			{};
	STG_Opts.SERVER_IP = 	'http://localhost:8085';

	$( window ).ready( function() {
		var Report = function( msg ) {
			console.log( msg );
		};

		var executionFail = false;

		var openPage = ( function() {

			var beginHtml = function( onDbgStart ) {
				var html = $('<h1>Staged Javascript Debugger</h1>					\
				<p>Open inspect element tools, then</p>								\
				<p>																	\
					<button type="button" class="btn btn-primary startdbg-btn">		\
						Start Debugging 											\
					</button>														\
				</p>');
				html.find( '.startdbg-btn' ).click( onDbgStart );
				return html;
			}

			var onProgressHtml = function() {
				return '<h1>Staged Javascript Debugger</h1>							\
				<h3>debugging...</h3>';
			}

			var finishedHtml = function() {
				return '<h1>Staged Javascript Debugger</h1>							\
				<h3>finished</h3>';
			};

			var errorHtml = function( msg ) {
				return '<div class="alert alert-danger" role="alert">				\
			    	<strong>An error occurred</strong> 								\
			    	<span class="stg-err-details"> ' + msg + ' <span>				\
			    </div>'
			};

			var pages = {
				BEGIN: 			beginHtml,
				ONPROGRESS: 	onProgressHtml,
				FINISHED: 		finishedHtml,
				ERROR: 			errorHtml
			};

			var containerSel = $( '#content' );

			var openPage = function( pId ) {
				var page = pages[ pId ].apply( undefined, _.toArray(arguments).slice(1) );
				containerSel.empty();
				containerSel.append( page );
			};

			return openPage;
		} )();

		var STG_ServerSend = global.STG_ServerSend = ( function() {

			var serverRoutes = ( function() {
				var genRoute = function( url, type, dataType  ) {
					dataType = dataType || 'json';
					var contentType = 'application/json';
					return {
						url: 			url,
						type: 			type,
						dataType: 		dataType,
						contentType: 	contentType
					};
				};
				var serverRoutes = {};
				serverRoutes.NEXT_STAGE = 		genRoute( 'nextstage', 		'post' );
				serverRoutes.EXEC_INLINE = 		genRoute( 'execinline', 	'post' );
				serverRoutes.INSPECT_AST = 		genRoute( 'inspectast', 	'post' );
				serverRoutes.CLOSE_SESSION = 	genRoute( 'closesession', 	'post' );
				return serverRoutes;
			} )();

			return function( args ) {

				var routeInf = serverRoutes[ args.routeId ];
				var ajaxOpts = {
		            type: 			routeInf.type,
		            url: 			STG_Opts.SERVER_IP + '/' + routeInf.url,
		            async: 			args.async,
		            cache: 			false,
		            data: 			args.data,
		            dataType: 		routeInf.dataType,
		            contentType: 	routeInf.contentType,

		            success: function( resp ) { 
		            	return args.success( resp.msg );
		            },
		            error: 	function( resp ) {	
		            	return args.fail( resp );
		            }
		        };
		        $.ajax( ajaxOpts );
			};

		} )();

		var onServerNextStageError = function( resp ) {
			executionFail = true;
			openPage( 'ERROR', 'server error on next stage.' );
		};

		var onServerInlineError = function( resp ) {
			executionFail = true;
			openPage( 'ERROR', 'inline execution fail on server.' );
		};

		var StagedException = function( msg ) {
			this.msg = msg
		};

		var isAstObj = function( astObj ) {
			return _.property( 'type' )( astObj ) === 'Program';
		};

		var mngGetBody = function( node, fromStmt ) {
			if( !isAstObj( node ) )
				return;

			var body = node.body;
			if( body ) {
				if( fromStmt ) {
					return _.toArray( body );
				}else {
					return _.map( body, function( stmt ) {
						return stmt.expression;
					} );
				}
			}
		};

		///////////////////////////////////////////////////////////
		//	Staged Escape Value Library Function
		(function() {
			var mEscapeVal = function( value ) {
				return {
					type: 'Literal',
					value: value
				};
			}

			global.meta_escapejsvalue = mEscapeVal;
		})();
		///////////////////////////////////////////////////////////


		///////////////////////////////////////////////////////////
		//	Staged Escape Library Function
		(function() {
			var mEscapeArray = function( normalNodes, escapeNodes, fromStmt ) {
				var idxOffset = 0;
				_.each( escapeNodes, function( pair ) {
					var body = mngGetBody( pair.expr, fromStmt );
					if( !body ) {
						throw new StagedException( 'body not found in ast' );
					}
					var args = [ pair.index + idxOffset, 0 ];
					args = args.concat( body );
					Array.prototype.splice.apply( normalNodes, args );
					//normalNodes.splice( pair.index + idxOffset, 0, body );
					++idxOffset;
				} );
				return normalNodes;
			}

			var mEscapeNode = function( node, fromStmt ) {
				var body = mngGetBody( node, fromStmt );
				if( !body ) {
					throw new StagedException( 'body not found in ast' );
				}
				return body.length === 1 ? body[0] : body;
			}

			var mEscape = function( fromArray ) {
				return ( fromArray ? mEscapeArray : mEscapeNode )
				    	.apply( undefined, _.toArray(arguments).slice(1) );
			}

			global.meta_escape = mEscape;
		})();
		///////////////////////////////////////////////////////////

		///////////////////////////////////////////////////////////
		//	Staged Inline Library Function
		(function() {
			var onServerInlineSuccess = function( resp ) {
				Report( 'inline executed' );
			};
			var mInline = function( astObj ) {
				if( executionFail ) {
					return;
				}
				if( !isAstObj( astObj ) ) {
					throw new StagedException( 'trying to inline a non-ast object' );
				}
				var astStr = JSON.stringify( astObj );
				STG_ServerSend( {
					routeId: 	'EXEC_INLINE', 
					data: 		astStr, 
					async: 		false,
					success: 	onServerInlineSuccess, 
					fail: 		onServerInlineError
				} );
			};

			global.inline = mInline;
		})();


		global.STG_InspectAst = function( ast ) {
			if( !isAstObj( ast ) ) {
				Report( 'argument is not an ast' );
				return ast;
			}
			var onServerInspectError = function() {
				Report( 'inspection fail on server' );
			};

			var onServerInspectSuccess = function() {
				Report( 'inspected' );
			};

			STG_ServerSend( {
				routeId: 	'INSPECT_AST', 
				data: 		JSON.stringify( ast ), 
				async: 		false,
				success: 	onServerInspectSuccess, 
				fail: 		onServerInspectError
			} );
		};


		///////////////////////////////////////////////////////////
		//	Staged Logic
		function startDebugging() {
			var onServerNextStageStart = function( msg ) {
				if( msg.depth === 0 ) {
					openPage( 'FINISHED' );
				}else {
					var src = unescape( msg.srcCode );
					openPage( 'ONPROGRESS' );
					_.defer( function() {
						eval( src );
						startDebugging();
					} ); 
				}
			};	

			STG_ServerSend( {
				routeId: 	'NEXT_STAGE', 
				async: 		true,
				success: 	onServerNextStageStart, 
				fail: 		onServerNextStageError
			} );
		};

		openPage( 'BEGIN', startDebugging );


		///////////////////////////////////////////////////////////
	} );

} )(window);