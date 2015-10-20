// optionsgenerator.js
// Library for automatic generating simple form elements. 
// Elements has some basic functionality like setValue, onChange.
// Giannis Apostolidis
// March 2015.
//

( function( root, factory ) {

	// Set up ast traverse appropriately for the environment. Start with AMD.
	if ( typeof define === 'function' && define.amd ) {
		define( [ 'underscore', 'jquery', 'exports' ], function( _, $, exports ) {
			// Export global even in AMD case in case this script is loaded with
			// others that may still expect a global ast traverse.
			root.Ast = root.Ast || {};
			root.Ast.OptionsGen = exports = factory( root, _, $  );
		} );

	// Next for Node.js or CommonJS.
	}else if( typeof exports !== 'undefined' ) {
		var _ = require( 'underscore' );
		var $ = require( 'jquery' );
		exports = factory( root, _, $  );
	
		// Finally, as a browser global.
	}else {
		root.Ast = root.Ast || {};
		var $ = root.jQuery || root.Zepto || root.ender || root.$;
		root.Ast.OptionsGen = factory( root, root._, $ );
	}

}( this, function( global, _, $ ) {

	function OptionsGenException( reason ) {
		this.reason = reason;
	};

	var OptionsGen_Assert = function( cond, msg ) {
        if( !cond ) {
          	throw new OptionsGenException( msg );
      	}
	};

	OptionsGen_Assert( typeof _ === 'function', 'underscore is not included' );
	OptionsGen_Assert(  typeof $ === 'function', 'jquery is not included' );

	var rootDom;

	var genOpt = function( html, opt, fields ) {
		var drawOpt = {
			html: 	$( html ),
			opt: 	opt
		};
		fields[ opt.name ] = drawOpt;
		return drawOpt;
	};

	var initOpt = function( opt, drawOpt, setVal ) {
		if( opt.val ) {
			setVal( opt.val );
		}
		drawOpt.setVal = setVal;
		return drawOpt;
	};

	var drawOptButton = function( opt, fields ) {
		var html = 
		"<div class='form-group form-group-sm col-xs-6'>											\
		    <label for='" + opt.name + "' class='col-xs-5 control-label'>" + opt.label + "</label>	\
			<div class='col-xs-7'>																	\
				<button type='button' class='form-control btn btn-" + opt.kind + "' id='" + opt.name + "'></button>\
			</div>																					\
		</div>";
		var drawOpt = genOpt( html, opt, fields );
		var inputSel =  drawOpt.html.find( 'button' );

		var setVal = function( val ) {
			inputSel.text( val );
		};

		inputSel.click( function() {
			var txt = inputSel.text();
			opt.onChange( drawOpt, txt );
		} );

		return initOpt( opt, drawOpt, setVal );
	};

	var drawFormWrapperHtml = function( forms, fields ) {
		var html =  "<form class=''><form>";
		return $(html);
	};

	var genDrawOptText = function( type ) {

		return function( opt, fields ) {
			var html = 
			"<div class='form-group form-group-sm col-xs-6'>											\
			    <label for='" + opt.name + "' class='col-xs-5 control-label'>" + opt.label + "</label>	\
				<div class='col-xs-7'>																	\
					<input type='" + type + "' class='form-control input-sm' id='" + opt.name + "'>		\
				</div>																					\
			</div>";
			var drawOpt = genOpt( html, opt, fields );
			var inputSel =  drawOpt.html.find( '.form-control' );

			var setVal = function( val ) {
				inputSel.val( val );
			};

			inputSel.change( function() {
				var val = $(this).val();
				if( type === 'number' ) {
					val = parseFloat( val );
				}
				opt.onChange( drawOpt, val );
			} );

			return initOpt( opt, drawOpt, setVal );
		};
	};

	var drawOptCheck = function( opt, fields ) {
		var html = 
		"<div class='form-group'>									\
		    <div class='col-sm-offset-2 col-sm-10'>					\
		      <div class='checkbox'>								\
		        <label class='control-label'>						\
		          <input type='checkbox' class='form-control input-sm' id='" + opt.name + "'> 	\
		          	" + opt.label + "								\
		        </label>											\
		      </div>												\
		    </div>													\
		  </div>";

		var drawOpt = genOpt( html, opt, fields );
		var inputSel =  drawOpt.html.find( 'input' );

		var setVal = function( val ) {
			inputSel.prop( 'checked', !!val );
		};

		inputSel.change( function() {
			var val = $(this).prop( 'checked' );
			opt.onChange( drawOpt, val );
		} );

		return initOpt( opt, drawOpt, setVal );
	};

	var drawOptSelect = function( opt, fields ) {

		var optionshtml = [];
		_.each( opt.options, function( option ) {
			optionshtml.push(
				"<option value='" + option.key + "'>" + option.val + "</option>"
			);
		} );

		var html = 
		"<div class='form-group form-group-sm col-xs-6'>										\
		    <label for='" + opt.name + "' class='col-xs-5 control-label'>" + opt.label + "</label>\
		    <div class='col-xs-7'>																\
				<select class='form-control input-sm' id='" + opt.name + "'>					\
					" + optionshtml.join('') + "												\
				</select>																		\
			</div>																				\
		</div>";
		var drawOpt = genOpt( html, opt, fields );
		var inputSel =  drawOpt.html.find( 'select' );
		var inputValsSel =  drawOpt.html.find( 'select option' );

		var setVal = function( val ) {
			inputValsSel.filter( function() {
			    return $(this).val() === val; 
			} ).prop( 'selected', true );
		};

		inputSel.change( function() {
			var val = $(this).val();
			opt.onChange( drawOpt, val );
		} );

		return initOpt( opt, drawOpt, setVal );
	};

	var drawOptText = genDrawOptText( 'text' );

	var drawOptNumber = genDrawOptText( 'number' );

	var drawOptSlider = function( opt, fields ) {
		var html =
		"<div class='form-group form-group-sm col-xs-6'>											\
		    <label for='" + opt.name + "' class='col-xs-5 control-label'>" + opt.label + "</label>	\
			<div class='col-xs-7'>																	\
				<input type='text' class='form-control input-xs' id='" + opt.name + "'>				\
				<b class='curr-val'></b> 															\
			</div>																					\
		</div>";
		var drawOpt = genOpt( html, opt, fields );
		var slider = drawOpt.html.find( '.form-control' ).slider( {
			min: 		opt.min,
			max: 		opt.max,
			step: 		opt.step,
			tooltip: 	'hide'
		} );
		var valSel = drawOpt.html.find( '.curr-val' );

		var setVal = function( val ) {
			slider.slider( 'setValue', val );
			valSel.text( val );
		}

		slider.on( 'slide', function() {
			var val = $( this ).slider( 'getValue' );
			opt.onChange( drawOpt, val );
			valSel.text( val );
		} );

		return initOpt( opt, drawOpt, setVal );
	};


	var drawOptFieldet = function( opt, fields ) {
		var innerHtml = drawMenuOptions( opt.children, fields );
		var html =  
		"<fieldset id='" + opt.name + "'>			\
		 	<legend>" + opt.label + "</legend>		\
	  	</fieldset>";
	  	var drawOpt = genOpt( html, opt, fields );
	  	drawOpt.html.append( innerHtml );
	  	return initOpt( opt, drawOpt );
	}

	var drawTreeOption = ( function() { 

		var optsMap = {
			button: 		drawOptButton,
			checkbox: 		drawOptCheck,
			select: 		drawOptSelect,
			text: 			drawOptText,
			number: 		drawOptNumber,
			slider: 		drawOptSlider,
			fieldset: 		drawOptFieldet
		};

		return function( opt, fields ) {
			return optsMap[ opt.type ]( opt, fields );
		};
	} )();

	var drawMenuOptions = function( opts, fields ) {

		var formRoot = drawFormWrapperHtml();

		_.each( opts, function( opt ) {
			var drawOpt = drawTreeOption( opt, fields );
			formRoot.append( drawOpt.html );
		} );

		return formRoot;
	};

	var draw = function( targetSel, opts ) {
		rootDom = targetSel;
		var fields = {};

		var html = drawMenuOptions( opts, fields );

		var get = function( name ) {
			return fields[ name ];
		}

		var hide = function( name ) {
			var opt = get( name );
			opt.html.hide();
		};

		var show = function( name ) {
			var opt = get( name );
			opt.html.show();
		};


		rootDom.append( html );
		return {
			html: 		html,
			hide: 		hide,
			show: 		show,
			get: 		get
		};
	};


	return { 
		drawOptions: 	draw 
	};

} ) );


