// litemail.js
// 
// Giannis Apostolidis
// May 2015.
//

.& {
	var XML_PARSER_PATH = "Src\\examples\\EmailClient\\app\\js\\lib\\xparse.js";
	var BASIC_LAYOUT_XRC_PATH = "Src\\examples\\EmailClient\\fomrbuilder\\basicLayout.xrc";
	var LEFT_MENU_XRC_PATH = "Src\\examples\\EmailClient\\fomrbuilder\\leftMenu.xrc";
	var EMAIL_LIST_XRC_PATH = "Src\\examples\\EmailClient\\fomrbuilder\\emailList.xrc";
	var EMAIL_LIST_ITEM_XRC_PATH = "Src\\examples\\EmailClient\\fomrbuilder\\emailListItem.xrc";
	var COMPOSE_EMAIL_XRC_PATH = "Src\\examples\\EmailClient\\fomrbuilder\\composeEmail.xrc";
	var HEADER_XRC_PATH = "Src\\examples\\EmailClient\\fomrbuilder\\header.xrc";

	var UNDERSCORE_PATH = "Src\\examples\\EmailClient\\app\\js\\lib\\underscore.js";

	load( UNDERSCORE_PATH );

	var XrcConv = {};

	XrcConv.xrcToHtml = ( function() {

		function WXFormatException( reason ) {
			print( reason );
			this.reason = reason;
		};

		var WX_GrammarCheckCond = function( cond, msg ) {
	        if( !cond ) {
	          	throw new WXFormatException( msg || '' );
	      	}
		};

		var WX_GrammarCheck = function() {
			var targetObj = arguments[0];
			for( var i = arguments.length - 1; i !== 0; --i ) {
				if( !_.has( targetObj, arguments[ i ] ) ) {
					throw new WXFormatException();
				}
			}
		};

		var ApplyToElems = function( doc, applier ) {
			_.each( doc.contents, function( content ) {
				if( content.type == "element" ) {
					applier( content.name, GetElemText( content ) );
				}
			} );
		};

		var GetElem = function( doc, name ){
			return _.find( doc.contents, function( content ) {
				return  content.type == "element" && content.name == name;
			} );
		};

		var GetElems = function( doc, name ){
			return _.filter( doc.contents, function( content ) {
				return  content.type == "element" && content.name == name;
			} );
		};

		var GetAttr = function( doc, name ){
			return doc.attributes[name];
		}

		var GetElemText = function( doc ){
			if( doc && _.isArray( doc.contents ) && doc.contents.length > 0 ) {
				var content = doc.contents[0];
				if( content.type === 'chardata' && content.value ) {
					return content.value.trim();
				}
			}
		};

		var iterateValue = function( elemName, arg ) {
			return _.isFunction( elemName ) ? elemName( arg ) : elemName;
		};

		var CreateSimpleElem = function( elemName, wxName, applier ) {
			return function( xrc, parent, opts ) {
				var label = GetElemText( GetElem( xrc, 'label' ) );
				var sizeObj = GetElem( xrc, 'size' );
				var name = GetAttr( xrc, 'name' );

				return .<
					( function( parent ) {
						var divroot = document.createElement( .@( iterateValue( elemName, xrc ) ) );
						.~AppendClassAttr( .< divroot; >., wxName, name );

						.~( applier ? applier( .< divroot; >., xrc, parent, opts ) : .<;>. );

						.~WXParse_attributeSize( sizeObj, .< divroot; >. );
						.~ApplyOptions( .< divroot; >., opts );
						parent.appendChild( divroot );
					} )( .~parent );
				>.;
			};
		};

		var CreateSimpleElemWithText = function( elemName, wxName, applier ) {
			return CreateSimpleElem( elemName, wxName, function( el, xrc, parent, opts ) {
				var label = GetElemText( GetElem( xrc, 'label' ) );
				return  .<
					var textNode = document.createTextNode( .@label );
					(.~el).appendChild( textNode );
					.~( WXParse_wxWindow( xrc, el ) );
					.~( applier ? applier( el, xrc, parent, opts ) : .<;>. );
				>.;
			} );
		};

		var CreateListElem = function( elemName, wxName, applier ) {

			return function( xrc, parent, opts ) {

				var name = GetAttr( xrc, 'name' );
				var sizeObj = GetElem( xrc, 'size' );

				return .<
					( function( parent ) {
						var divroot = document.createElement( .@elemName );
						.~AppendClassAttr( .< divroot; >., wxName, name );

						.~( applier ? applier( .< divroot; >., xrc, parent, opts ) : .<;>. );

						.~WXParse_attributeSize( sizeObj, .< divroot; >. );
						.~ApplyOptions( .< divroot; >., opts );
						parent.appendChild( divroot );
					} )( .~parent );
				>.
			};

		};

		var StyleContainsAlignRight = function( xrc ) {
			if( xrc ) {
				var alignText = GetElemText( xrc );
				return alignText && alignText.indexOf( 'wxALIGN_RIGHT' ) !== -1;
			}
			return false;
		};

		var AppendClassAttr = function( el ) {
			var newClassVals = _.map( _.rest( arguments ), function( arg ) {
				return arg;
			} ).join( ' ' );
			return .<
				(.~el).setAttribute( 'class', ((.~el).getAttribute( 'class' ) || '') + ' ' + .@newClassVals );
			>.;
		};

		var WXParse_wxWindow = ( function() {
			var wxWindowFontObjs = {
				size: function( el, val ) {
					val = +val;
					return val === -1 ? .<;>. : .< 
						(.~el).style.fontSize = .@( ( val + 10 ) + 'px' );
					>.;
				},
				underlined: function( el, val ) {
					var css = +val === 0 ? 'initial' : 'underline';
					return .< 
						(.~el).style.textDecoration = .@css;
					>.;
				}
			};

			return function( xrc, el ) {
				var applingAst = .< ; >.;
				var fontObj = GetElem( xrc, 'font' );
				if( fontObj ) {
					ApplyToElems( fontObj, function( name, val ) {
						var wxWindowFontObj = wxWindowFontObjs[ name ];
						if( wxWindowFontObj ) {
							applingAst = .< 
								.~applingAst;

								.~wxWindowFontObj( el, val );
							>.;
						}
					} );
				}
				return applingAst;
			};
		} )();

		var WXParse_attributeSize = function( xrc, el ) {
			var sizeText = GetElemText( xrc );
			if( sizeText ) {
				var dimStr = sizeText.split( ',' );
				return .< 
				(.~el).style.width = .@( +dimStr[0] + 'px' );
				(.~el).style.height = .@( +dimStr[1] + 'px' );
			>.;	
			}else {
				return .< ; >.;
			}
		};

		// var WXParse_elementStyle = ( function() {

		// 	var flags = { 
		// 		wxTE_MULTILINE: 			function( el ) {

		// 		}
		// 	};

		// 	return function() {

		// 	};

		// } )();

		var WXParse_attributeFlag = ( function() { 

			var alignCenter = function( el ) {
				return .< 
					(.~el).style.textAlign = 'center';
				>.;
			};

			var flags = {
				wxALIGN_BOTTOM: 			null,
				wxALIGN_CENTER: 			alignCenter,
				wxALIGN_CENTER_HORIZONTAL: 	alignCenter,
				wxALIGN_CENTER_VERTICAL: 	null,
				wxALIGN_LEFT: 				function( el ) {
					return .< 
						(.~el).style.float = 'left';
					>.;
				},
				wxALIGN_RIGHT: 				function( el ) {
					return .< 
						(.~el).style.float = 'right';
					>.;
				},
				wxALIGN_TOP: 				null,
				wxALL: 						function( el, border ) {
					return .< 
						(.~el).style.padding = .@(border) + 'px';
					>.;
				},
				wxBOTTOM: 					function( el, border ) {
					return .< 
						(.~el).style.paddingBottom = .@(border) + 'px';
					>.;
				},
				wxEXPAND: 					function( el, border ) {
					return .< 
						(.~el).style.display = 'block';
					>.;
				},
				wxFIXED_MINSIZE: 			null,
				wxLEFT: 					function( el, border ) {
					return .< 
						(.~el).style.paddingLeft = .@(border) + 'px';
					>.;
				},
				wxRIGHT: 					function( el, border ) {
					return .< 
						(.~el).style.paddingRight = .@(border) + 'px';
					>.;
				},
				wxSHAPED: 					null,
				wxTOP: 						function( el, border ) {
					return .< 
						(.~el).style.paddingTop = .@(border) + 'px';
					>.;
				}

			};

			return function( el, xrc, border ) {
				var flagsText = GetElemText( xrc );
				var applingAst = .< ; >.;
				if( !flagsText ) {
					return applingAst;
				}
				var flagsStr = flagsText.split( '|' );

				

				_.each( flagsStr, function( flagStr ) {
					flagStr = flagStr.trim();
					var flag = flags[ flagStr ];
					if( flag ) {
						var flagAst = flag( el, border );
						applingAst = .< .~applingAst; .~flagAst; >.;
					}
				} );
				return applingAst;
			};
		} )();

		var WXParse_objectStaticText = CreateSimpleElemWithText( 'label', 'wx-wxStaticText', function( el, xrc, parent, opts ) {
			return .< (.~el).style.display = 'block'; >.;
		} );

		var WXParse_objectChoice = CreateListElem( 'select', 'wx-wxChoice', function( el, xrc, parent, opts ) {
			var itemsObj = GetElems( GetElem( xrc, 'content' ), 'item' );
			var itemsEl = .< ; >.;
			_.each( itemsObj, function( itemObj ) {
				var itemLabel = GetElemText( itemObj );
				itemsEl = .< 
					.~itemsEl;

					var option = document.createElement( 'option' );
					var textNode = document.createTextNode( .@itemLabel );
					option.appendChild( textNode );
					(.~el).appendChild( option );
				>.;
			} );
			return itemsEl;
		} );


		var WXParse_spacer = CreateSimpleElem( 'div', 'wx-spacer' );

		var WXParse_objectButton = CreateSimpleElemWithText( 'button', 'wx-wxButton' );

		var WXParse_objectText = CreateSimpleElem( function( xrc ) {  
			var style = GetElem( xrc, 'style' )
			if( style ) {
				style = GetElemText( style );
				if( style.indexOf( 'wxTE_MULTILINE' ) !== -1 ) {
					return 'textarea'
				}
			}
			return 'input';
		}, 'wx-wxTextCtrl' );

		var WXParse_objectCheckBox =  CreateListElem( 'div', 'wx-wxCheckBox-container', function( el, xrc, parent, opts ) {
			var label = GetElemText( GetElem( xrc, 'label' ) ),
				alignRight = StyleContainsAlignRight( GetElem( xrc, 'style' ) ),
				name = GetAttr( xrc, 'name' );

			var labelAst = label ? .<
					var label = document.createElement( 'label' );
					label.setAttribute( 'class', 'wx-wxCheckBox-label' );
					var textNode = document.createTextNode( .@label );
					label.appendChild( textNode );
					divroot.appendChild( label );
				>. : .< ; >.;

			var inputAst = .<
				var input = document.createElement( 'input' );
				input.type = 'checkbox';
				.~AppendClassAttr( .< input; >., 'wx-wxCheckBox', name );
				divroot.appendChild( input );
			>.;
			return alignRight ? .< .~inputAst; .~labelAst; >. : .< .~labelAst; .~inputAst; >.;
		} );

		var WXParse_objectListBox = CreateSimpleElem( 'div', 'wx-wxCheckBox' );

		var WXParse_objectHyperlinkCtrl = CreateSimpleElemWithText( 'a', 'wx-wxHyperlinkCtrl', function( el, xrc, parent, opts ) {
			var url = GetElemText( GetElem( xrc, 'url' ) );
			return .< 
				(.~el).setAttribute( 'href', .@url );
			>.;
		} );

		var ApplyOptions = function( el, opts ) {
			if( _.has( opts, 'flagObj'  ) ) {
				WX_GrammarCheckCond( opts.borderObj, 'contain flagObj but not borderObj ' );
				var border = +GetElemText( opts.borderObj );
				return WXParse_attributeFlag( el, opts.flagObj, border );
			}
			return .< ; >.;
		};

		var WXParse_objectBoxSizer = CreateListElem( 'div', 'wx-wxBoxSizer', function( el, xrc, parent, opts ) {
			var orient = GetElemText( GetElem( xrc, 'orient' ) ),
				orientClass = orient === 'wxVERTICAL' ? 'wx-vertical' : 'wx-horizontal',
				sizerItemsObj = GetElems( xrc, 'object' ),
				proportions = [],
				proportionsSum = 0;
				
			var itemsEl = .< 
				var elProportions = []; 
				.~AppendClassAttr( el, orientClass ); 
			>.;

			_.each( sizerItemsObj, function( sizerItemObj ) {
				var proportion = +GetElemText( GetElem( sizerItemObj, 'option' ) ) + 1;
				proportions.push( proportion );
				proportionsSum += proportion;

				itemsEl = .< 
					.~itemsEl;

					var divItem = document.createElement('div');
					divItem.setAttribute( 'class', 'wx-wxBoxSizer-item' );
					.~WXParse_objectSizerItem( sizerItemObj, .< divItem; >. );
					divroot.appendChild( divItem );
					elProportions.push( divItem );
				>.;
			} );

			if( orientClass === 'wx-horizontal' ) {
				itemsEl = .< 
					.~itemsEl;

					var divClear = document.createElement('div');
					divClear.setAttribute( 'class', 'wx-clearfix' );
					divroot.appendChild( divClear );
				>.;
			}

			_.each( proportions, function( proportion, propIdx ) {
				var percProportion = proportion/proportionsSum * 100;
				var widthStyleAst = proportion === 1 ? .<;>. : .< 
						var elStyle = elProportions[ .@propIdx ].style;
						if( !elStyle.width ) {
							elStyle.width = .@( percProportion + '%' );
						}
					>.;
				itemsEl = .< 
					.~itemsEl;

					.~widthStyleAst;
				>.;

			} );
			return itemsEl;
		} );

		var WXParse_objectFlexGridSizer = CreateListElem( 'div', 'wx-wxFlexGridSizer', function( el, xrc, parent, opts ) {
			var rows = +GetElemText( GetElem( xrc, 'rows' ) ),
				cols = Math.max( +GetElemText( GetElem( xrc, 'cols' ) ), 1 ),
				sizerItemsObj = GetElems( xrc, 'object' ),
				hasDivRow = false;

			var itemsEl = .< ; >.;
			_( sizerItemsObj.length ).times( function( itemIdx ) {
				if( itemIdx % cols === 0 ) {
					if( hasDivRow ) {
						itemsEl = .< .~itemsEl; divroot.appendChild( divRow ); >.;
					}
					itemsEl = .< 
						.~itemsEl;

						var divClear = document.createElement('div');
						divClear.setAttribute( 'class', 'wx-clearfix' );
						(.~parent).appendChild( divClear );
						var divRow = document.createElement('div');
						divRow.setAttribute( 'class', 'wx-wxFlexGridSizer-row' );
						(.~parent).appendChild( divRow );
					>.;
				}
				hasDivRow = true;
				itemsEl = .< 
					.~itemsEl;

					var divCol = document.createElement('div');
					divCol.setAttribute( 'class', 'wx-wxFlexGridSizer-col' );
					.~WXParse_objectSizerItem( sizerItemsObj[ itemIdx ], .< divCol; >. );	
					divRow.appendChild( divCol );
				>.;
			} );
			return itemsEl;
		} );

		var WXParse_objectSizer = ( function() {

			var sizers = {
				'wxBoxSizer': 		WXParse_objectBoxSizer,
				'wxFlexGridSizer': 	WXParse_objectFlexGridSizer
			};

			return function( xrc, parent ) {
				var classType = GetAttr( xrc, 'class' );
				var sizer = sizers[ classType ];
				WX_GrammarCheckCond( sizer, 'sizer: ' + classType );
				return sizer( xrc, parent );
			};

		} )();

		var WXParse_objectPanel = CreateSimpleElem( 'div', 'wx-panel', function( el, xrc, parent, opts ) {
			var sizerObj = GetElem( xrc, 'object' );
			return sizerObj ? WXParse_objectSizer( sizerObj, .< divroot; >. ) : .< ; >.
		} );

		var WXParse_objectSizerItem = ( function() {

			var items = {
				'wxPanel': 			WXParse_objectPanel,
				'wxBoxSizer': 		WXParse_objectBoxSizer,
				'wxStaticText': 	WXParse_objectStaticText,
				'wxChoice': 		WXParse_objectChoice,
				'wxButton': 		WXParse_objectButton,
				'wxTextCtrl': 		WXParse_objectText,
				'wxCheckBox': 		WXParse_objectCheckBox,
				'wxListBox': 		WXParse_objectListBox,
				'wxHyperlinkCtrl': 	WXParse_objectHyperlinkCtrl,

			};

			return function( xrc, parent ) {
				var itemStyle = {
					borderObj: 	 GetElem( xrc, 'border' ),
					flagObj: 	GetElem( xrc, 'flag' )
				}

				var parentClassType = GetAttr( xrc, 'class' );
				if( parentClassType === 'spacer' ) {
					return WXParse_spacer( xrc, parent, itemStyle );
				}else {
					var itemObj = GetElem( xrc, 'object' );
					var classType = GetAttr( itemObj, 'class' );
					var item = items[ classType ];
					WX_GrammarCheckCond( item, 'unsupposed wx item: ' + classType );
					return item( itemObj, parent, itemStyle );
				}
			};

		} )();

		var WXParse_resource = function( xrc, functorName ) {
			var panelObj = GetElem( xrc, 'object' );
			return .< 
				UIGenerators[ .@(functorName) ] = function() {
					var divroot = document.createElement('div');
					divroot.setAttribute( 'class', 'wx-resource' );
					.~WXParse_objectPanel( panelObj, .< divroot; >. );
					return divroot;
				};
			 >.;
		};

		var WXParse = function( xrc, functorName ) {
			var resourceObj = GetElem( xrc, 'resource' );
			return WXParse_resource( resourceObj, functorName );
		};

		return WXParse;
	} )();

	XrcConv.generateUI = ( function() {

		var Init = function() {
			load( XML_PARSER_PATH );
		};

		var GenerateFragmentUI = function( xrcPath, functorName ) {
			var xrcStr = read( xrcPath );
			var xrc = Xparse( xrcStr );
			return XrcConv.xrcToHtml( xrc, functorName );
		};

		var Gen = function() {
			return .< 
				.~GenerateFragmentUI( BASIC_LAYOUT_XRC_PATH, 'basicLayout' );
				.~GenerateFragmentUI( LEFT_MENU_XRC_PATH, 'leftMenu' );
				.~GenerateFragmentUI( EMAIL_LIST_XRC_PATH, 'emailList' );
				.~GenerateFragmentUI( EMAIL_LIST_ITEM_XRC_PATH, 'emailListItem' );
				.~GenerateFragmentUI( COMPOSE_EMAIL_XRC_PATH, 'composeEmail' );
				.~GenerateFragmentUI( HEADER_XRC_PATH, 'header' );
			>.;
		};

		return {
			Init: 		Init,
			Gen: 		Gen
		};
	} )();


	XrcConv.generateUI.Init();
};

var UIGenerators = {};
.!XrcConv.generateUI.Gen();
tmplBasicLayout = UIGenerators.basicLayout();
tmplLeftMenu = UIGenerators.leftMenu();
tmplEmailList = UIGenerators.emailList();
tmplEmailListItem = UIGenerators.emailListItem();
tmplComposeEmail = UIGenerators.composeEmail();
tmplHeader = UIGenerators.header();
