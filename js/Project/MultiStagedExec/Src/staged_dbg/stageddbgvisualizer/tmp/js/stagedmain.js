





$( document ).ready( function() {
  
  	var Models = ( function() {

  		var Model = {
  			set: function( key, val ) {
  				this.trigger( 'changevalue', key, val );
  				this[ key ] = val;
  			},
  			get: function( key ) { return this[ key ]; }
  		};

  		var DebugProcess = function( args ) {
  			_.defaults( this, {
  				status: 	'not connected',
  				depth: 		0,
  				inlines: 	0,
  				src: 		''
  			} );
  		};

  		_.extend( DebugProcess.prototype, STG_Events, Model );

  		var DebugError = function( args ) {
  			_.defaults( this, {
  				descr: 		''
  			} );
  		};

  		_.extend( DebugError.prototype, STG_Events, Model );

  		return {
  			DebugProcess: 	DebugProcess,
  			DebugError: 	DebugError
  		};

  	} )();

	var Views = ( function() {

		var contentSel = STG_Q( '#content .container' );

		var View = {
			init: function( target, model ) {
				this.target = target;
				this.model = model;
			},

			open: function() {
				this.el = $( _.template( this.target.html() )() );
				this.onOpen && this.onOpen();
				contentSel.append( this.el );
			},

			close: function() {
				this.el.remove();
				this.onClose && this.onClose();
			},
		};

		var ViewStartDbg = function( target ) {
			var that = this;
			this.init( target );

			this.onOpen = function() {		
				this.el.find( '.startdbg-btn' ).click( function() {
					that.trigger( 'startdbg' );
				} );
			};
		};

		_.extend( ViewStartDbg.prototype, STG_Events, View );

		

		var ViewProcessDbg = function( target, model ) {
			var that = this;
			this.init( target, model );

			this.onOpen = function() {

				var modelToView = {
					status: 	this.el.find( '.stg-prc-status' ),
					depth: 		this.el.find( '.stg-prc-depth'),
					inlines: 	this.el.find( '.stg-prc-inlines'),
					src: 		this.el.find( '.stg-prc-src')
				}

				this.fillValues = function() {
					_.each( modelToView, function( val, key ) {
						val.text( model.get( key ) );
					} );
				};

				model.on( 'changevalue', function( key, val ) {
					var viewName = STG_Get( modelToView, key );
					viewName.text( val );
				} );

				this.fillValues();
				var srcView = this.el.find( '.stg-prc-src' );
				var srcIsOpen = false;
				this.el.find( '.stg-prc-showsrc-btn' ).click( function() {
					$(this).text( srcIsOpen ? 'Show staged source code' : 'Hide staged source code' );
					srcIsOpen = !srcIsOpen;
					srcView.toggle( srcIsOpen );
				} );

				this.el.find( '.stg-prc-closesession' ).click( function() {
					that.trigger( 'closesession' );
				} );
			};
		}

		_.extend( ViewProcessDbg.prototype, STG_Events, View );



		var ViewfinishDbg = function( target ) {
			var that = this;
			this.init( target );

			this.onOpen = function() {
				this.el.find( '.stg-fns-closesession' ).click( function() {
					that.trigger( 'closesession' );
				} );
				this.el.find( '.stg-fns-inspect' ).click( function() {
					that.trigger( 'inspect' );
				} );
			};

			this.closeSession = function() {
				this.el.find( '.stg-fns-actions' ).remove();
				this.el.find( '.stg-fns-finished-txt' ).show();
			};
		};

		_.extend( ViewfinishDbg.prototype, STG_Events, View );


		var ViewErrorDbg = function( target, model ) {
			var that = this;
			this.init( target, model );
			
			this.fillValues = function() {
				this.el.find( '.stg-err-details' ).text( model.get( 'descr' ) );
			};

			this.onOpen = function() {
				this.fillValues();
			};
		};

		_.extend( ViewErrorDbg.prototype, STG_Events, View );

		return {
			StartDbg: 		ViewStartDbg,
			ProcessDbg: 	ViewProcessDbg,
			FinishDbg: 		ViewfinishDbg,
			ErrorDbg: 		ViewErrorDbg
		};
	} )();

	var startDbgTmpl = 		STG_Q( '#stg-start-debugging-tmpl' ), 
	processDbgTmpl = 		STG_Q( '#stg-process-debugging-tmpl' ), 
	finishDbgTmpl = 		STG_Q( '#stg-finish-debugging-tmpl' ), 
	errorDbgTmpl = 			STG_Q( '#stg-error-debugging-tmpl' ),

	debugProcess = 			new Models.DebugProcess(),
	debugError = 			new Models.DebugError(),

	viewStartDbg = 			new Views.StartDbg( startDbgTmpl ),
	ViewProcessDbg = 		new Views.ProcessDbg( processDbgTmpl, debugProcess ),
	ViewfinishDbg = 		new Views.FinishDbg( finishDbgTmpl ),
	viewErrorDbg = 			new Views.ErrorDbg( errorDbgTmpl, debugError );

	var changePage = function() {
		var pages = {
			viewStartDbg: viewStartDbg,
			ViewProcessDbg: ViewProcessDbg,
			ViewfinishDbg: ViewfinishDbg,
			viewErrorDbg: viewErrorDbg
		},
		currpage;
		return function( pageId ) {
			var page = STG_Get( pages, pageId );
			if( currpage ) {
				currpage.close();
			}
			page.open();
			currpage = page;
		};
	}();



	var inspectProgram = function() {
		alert( 'not implemented yet' );
		// var onInspectAstSuccess = function() {

		// };

		// var onInspectAstError = function() {

		// };

		// STG_ServerSend( {
		// 	routeId: 	'GET_AST', 
		// 	async: 		true,
		// 	success: 	onInspectAstSuccess, 
		// 	fail: 		onInspectAstError
		// } );
	};
	ViewfinishDbg.on( 'inspect', inspectProgram );

	var closeSession = function() {
		var onCloseSessionSuccess = function() {
			changePage( 'ViewfinishDbg' );
			ViewfinishDbg.closeSession();
		};

		var onCloseSessionError = function() {
			debugError.set( 'descr', 'server cannot close session' );
			changePage( 'viewErrorDbg' );
		};

		STG_ServerSend( {
			routeId: 	'CLOSE_SESSION', 
			async: 		true,
			success: 	onCloseSessionSuccess, 
			fail: 		onCloseSessionError
		} );
	};

	ViewProcessDbg.on( 'closesession', closeSession );
	ViewfinishDbg.on( 'closesession', closeSession );

	STG_ProcessEvents.on( 'inline:success', function( resp ) {
		debugProcess.set( 'inlines', resp.inlines );
	} );

	STG_ProcessEvents.on( 'inline:error', function( resp ) {
		debugError.set( 'descr', 'server error on inline' );
		changePage( 'viewErrorDbg' );
	} );

	function startDebugging() {
		var onStart = function( msg ) {
			if( msg.depth === 0 ) {
				changePage( 'ViewfinishDbg' );
			}else {
				var src = unescape( msg.srcCode );
				debugProcess.set( 'status', 'Connected' );
				debugProcess.set( 'depth', msg.depth );
				debugProcess.set( 'inlines', msg.inlines );
				debugProcess.set( 'src', src );
				changePage( 'ViewProcessDbg' );
				_.defer( function() {
					eval( src );
					startDebugging();
				} ); 
			}
		};	

		var onFail = function( resp ) {
			debugError.set( 'descr', 'server error on next stage' );
			changePage( 'viewErrorDbg' );
		};

		STG_ServerSend( {
			routeId: 	'NEXT_STAGE', 
			async: 		true,
			success: 	onStart, 
			fail: 		onFail
		} );
	};

	viewStartDbg.on( 'startdbg', startDebugging );

	changePage( 'viewStartDbg' );


	var GenInspectAstWindow = function( targetAst ) {
		var html = 
		'		<html lang="en">' +
		'' +
		'		   <head>' +
		'' +
		'		      <meta charset="utf-8">' +
		'		      <title>Ast Tree View</title>' +
		'' +
		'		      <link href="http://localhost:8085/Src/staged_remote_dbg/css/bootstrap.min.css" rel="stylesheet">' +
		'		      <link href="http://localhost:8085/Src/staged_remote_dbg/css/bootstrap-slider.css" rel="stylesheet">' +
		'		      <link href="http://localhost:8085/Src/staged_remote_dbg/css/astview.css" rel="stylesheet">' +
		'' +
		'			  <script> var TARGET_AST = window.TARGET_AST = ' + targetAst + '; </script>' +
		'		      <script type="text/javascript" src="http://localhost:8085/Src/staged_remote_dbg/js/lib/jquery.min.js"></script>' +
		'		      <script type="text/javascript" src="http://localhost:8085/Src/staged_remote_dbg/js/lib/underscore.min.js"></script>' +
		'		      <script type="text/javascript" src="http://localhost:8085/Src/staged_remote_dbg/js/lib/bootstrap.min.js"></script>' +
		'		      <script type="text/javascript" src="http://localhost:8085/Src/staged_remote_dbg/js/lib/bootstrap-slider.min.js"></script>' +
		'' +
		'		      ' +
		'		      <script type="text/javascript" src="http://localhost:8085/Src/staged_remote_dbg/js/asttraverse.js"></script>' +
		'		      <script type="text/javascript" src="http://localhost:8085/Src/staged_remote_dbg/js/asttreestringify.js"></script>' +
		'		      <script type="text/javascript" src="http://localhost:8085/Src/staged_remote_dbg/js/asttreeview.js"></script>' +
		'		      <script type="text/javascript" src="http://localhost:8085/Src/staged_remote_dbg/js/optionsgenerator.js"></script>' +
		'		      <script type="text/javascript" src="http://localhost:8085/Src/staged_remote_dbg/js/asttreeviewdraw.js"></script>' +
		'		      <script type="text/javascript" src="http://localhost:8085/Src/staged_remote_dbg/js/asttreeviewwithoptions.js"></script>' +
		'' +
		'		   </head>' +
		'' +
		'		   <body>' +
		'' +
		'		    <div class="container">' +
		'		     <div id="astview-container" class="row">' +
		'		       <div class="astview-wrapper col-sm-9 col-sm-offset-1">' +
		'		         <div class="astview">' +
		'		          ' +
		'		         </div>' +
		'		       </div>' +
		'		       <div class="astopts col-sm-9 col-sm-offset-1">' +
		'' +
		'		       </div>' +
		'		     </div>' +
		'' +
		'		    </div>' +
		'			  <script>' +
		'				var ast = window.Ast.DrawTreeWithOpt();' +
		'				console.log( ast.domtree );' +
		'' +
		'				console.log( ast.src );' +
		'			</script>' +	
		'		   </body>' +
		'' +
		'		</html>';
		return html;
	};

	window.STG_InspectAst = function( ast ) {
		var astStr = JSON.stringify( ast );
		var inspectAstWindowHtml = GenInspectAstWindow( astStr );

		var inspectAstWindow = window.open( '', 'Inspect Ast' );
        inspectAstWindow.document.write( inspectAstWindowHtml );
        inspectAstWindow.document.close();
        inspectAstWindow.focus();
        // $( printWindow ).ready( function() {
        //     printWindow.print();
        // } );

		//console.log( ast );
	};
} );