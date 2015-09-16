// asttreeviewdraw.js
// Library for drawing a tree view in the dom. 
// Giannis Apostolidis
// March 2015.
//


( function( root, factory ) {

	// Set up ast traverse appropriately for the environment. Start with AMD.
	if ( typeof define === 'function' && define.amd ) {
		define( [ 'underscore', 'jquery', 'asttraverse', 'asttreeview', 'asttreestringify', 'exports' ], 
			function( _, $, astTraverse, astView, astStringify, exports ) {
				// Export global even in AMD case in case this script is loaded with
				// others that may still expect a global ast traverse.
				root.Ast = root.Ast || {};
				return root.Ast.DrawTree = exports = factory( root, _, $, astTraverse, astView.GenHtml, astStringify );
			} 
		);

	// Next for Node.js or CommonJS.
	}else if( typeof exports !== 'undefined' ) {
		var _ = require( 'underscore' );
		var $ = require( 'jquery' );
		var astTraverse = require( 'asttreeview' );
		var astView = require( 'asttreeview' );
		var astStringify = require( 'asttreestringify' );
		exports = factory( root, _, $, astView.GenHtml, astStringify );
	
		// Finally, as a browser global.
	}else {
		root.Ast = root.Ast || {};
		var $ = root.jQuery || root.Zepto || root.ender || root.$;
		var astTraverse = root.Ast.Traverse;
		var astGenHtml = root.Ast.GenHtml;
		var astStringify = root.Ast.Stringify;
		root.Ast.DrawTree = factory( root, root._, $,  astTraverse, astGenHtml, astStringify );
	}

}( this, function( global, _, $, AstTraverse, GenHtml, AstStringify ) {

	///////////////////////////////////////////////////////
	// Utilities
	function ASTTreeViewDrawerException( reason ) {
		this.reason = reason;
	};

	var ASTTreeViewDrawer_Assert = function( cond, msg ) {
        if( !cond ) {
          	throw new ASTTreeViewDrawerException( msg );
      	}
	};

	ASTTreeViewDrawer_Assert( typeof GenHtml === 'object', 'view generators are not included' );
	ASTTreeViewDrawer_Assert( typeof _ === 'function', 'underscore is not included' );
	ASTTreeViewDrawer_Assert( typeof $ === 'function', 'jquery is not included' );


	var cssPxToNumber = function( num ) {
		num = +num.substring( 0, num.length - 2 );
		ASTTreeViewDrawer_Assert( _.isNumber( num ) );
		return num;
	};

	var toggleClass = function( target, namespace, fname, sname, toggle ) {
		if( toggle ) {
			target.removeClass( namespace + fname );
			target.addClass( namespace + sname );
		}else {
			target.addClass( namespace + fname );
			target.removeClass( namespace + sname );
		}
	};
	///////////////////////////////////////////////////////


	///////////////////////////////////////////////////////
	// Geometric functions
	function CreatePoint( x, y ) {
		return { x: x, y: y };
	};

	var CreateDim = function( w, h ) {
		return { w: w, h: h };
	};

	var CreateSize = function( point, dim ) {
		return { point: point, dim: dim };
	};
	///////////////////////////////////////////////////////


	///////////////////////////////////////////////////////
	// General Tree manipulation
	var getTargetItem = function( node ) {
		var item = node.context ? node.context.STG_Data : node[0].STG_Data;
		ASTTreeViewDrawer_Assert( item );
		return item;
	};

	function calcChildDepth( node ) {
		if( !node.item.get(0).STG_Data ) {
			node.item.get(0).STG_Data = { target: node };
		}
		
		var maxChildren;
		if( node.isLeaf || _.has( node, 'realMaxChildren' ) ) {
			maxChildren = 1;
			node.maxChildren = 0;
		}else {
			maxChildren = _.reduce( node.children, function( memo, node ) {
				return memo + calcChildDepth( node );
			}, 0 );
			node.maxChildren = maxChildren;
		}
		return maxChildren;
	};

	var showRealChildren = function( node ) {
		node.maxChildren = node.realMaxChildren;
		delete node.realMaxChildren;
	};

	var hideRealChildren = function( node ) {
		node.realMaxChildren = node.maxChildren;
	};

	var hasHidenChildren = function( node ) {
		return _.has( node, 'realMaxChildren' );
	};

	///////////////////////////////////////////////////////


	///////////////////////////////////////////////////////
	// View default options value
	var defaultOptions = {
		ViewHeight:					400,
		NodeWidth: 					100,
		NodeHeight: 				30,
		NodeGapWidth: 				30,
		NodeGapHeight: 				30,
		LineWeight: 				1,
		CollapseTextLength: 		10,
		AstViewPadding: 			30,
		AstNodeMenuLeftPadding: 	5,
		AlignTreeViewToCenter:  	true,
		PreventCollapsion: 			false,
		CollapseBtnHeightOffset:	2
	};
	///////////////////////////////////////////////////////

 	function drawTree( targetTree, targetSel, opts ) {

 		var TVD_OPTS = {},

			tree, rootDom, wrapperRootDom, elements;


			var resizeViewHeight = function( val ) {
				rootDom.height( val );
			};

		///////////////////////////////////////////////////////
		// Change options 
		var redrawOnOption = {
			NodeWidth: 				true,
			NodeHeight: 			true,
			NodeGapWidth: 			true,
			NodeGapHeight: 			true,
			LineWeight: 			true,
			AstViewPadding: 		true,
			AstNodeMenuLeftPadding: true,
			CollapseTextLength: 	true
		};

		var changeOption = function( opts, redraw ) {
			if( opts.NodeWidth ) {
				TVD_OPTS.NodeWidth = opts.NodeWidth;
				TVD_OPTS.NodeWidthHalf = TVD_OPTS.NodeWidth/2;
				TVD_OPTS.MenuLeftPosition =  opts.NodeWidth - 2;
				TVD_OPTS.CollapseBtnWidthOffset = TVD_OPTS.NodeWidth + 2;
			}

			if( opts.NodeHeight ) {
				TVD_OPTS.NodeHeight = opts.NodeHeight;
			}

			if( opts.NodeGapWidth ) {
				TVD_OPTS.NodeGapWidth = opts.NodeGapWidth;
			}

			if( opts.NodeGapHeight ) {
				TVD_OPTS.NodeGapHeight = opts.NodeGapHeight;
			}

			if( opts.NodeGapWidth || opts.NodeWidth  ) {
				TVD_OPTS.SlotW = TVD_OPTS.NodeWidth + TVD_OPTS.NodeGapWidth;
			}

			if( opts.NodeGapHeight || opts.NodeHeight  ) {
				TVD_OPTS.SlotH = TVD_OPTS.NodeHeight + TVD_OPTS.NodeGapHeight;
			}
			
			if( opts.LineWeight ) {
				TVD_OPTS.LineWeight = opts.LineWeight;
			}

			if( opts.AstViewPadding ) {
				TVD_OPTS.AstViewPadding = opts.AstViewPadding;
			}

			if( opts.CollapseTextLength ) {
				TVD_OPTS.CollapseTextLength = opts.CollapseTextLength;
			}

			TVD_OPTS.PreventCollapsion = opts.PreventCollapsion;
			TVD_OPTS.CollapseBtnHeightOffset = opts.CollapseBtnHeightOffset;
			TVD_OPTS.ViewHeight = opts.ViewHeight;

			resizeViewHeight( opts.ViewHeight );

			var mustRedraw = _.some( _.keys( opts ), function( opt ) { 
				return redrawOnOption[ opt ];
			} );
			if( mustRedraw && redraw ) {
				TVD_OPTS.PreventCollapsion = true;
				reDrawTree();
			}
		};
		///////////////////////////////////////////////////////


		///////////////////////////////////////////////////////
		// Specific Tree manipulation 
		var postProcessNodes = function( tree ) {
			calcChildDepth( tree.root );




			if( !TVD_OPTS.PreventCollapsion ) {

				tree.topDownVisitor( undefined, function( node ) {
					hideRealChildren( node );
					node.maxChildren = 0;
				} );
				//tree.root.maxChildren = tree.root.children.length;

				// root.maxChildren = root.children.length;
				// _.each( root.children, function( child ) {
				// 	hideRealChildren( child );
				// 	child.maxChildren = 0;
				// } );
			}
		};


	 	var calcChildrenSlotsStartingPosition = function( point, slots ) {
	 		ASTTreeViewDrawer_Assert( slots > 0 );

	 		var y0 = point.y + TVD_OPTS.SlotH,
	 		 	x = point.x,
	 		 	x0;
	 		if( slots === 1 ) {
	 			x0 = x;
	 		}else if( slots % 2 === 0 ) {
				x0 = x - ( TVD_OPTS.SlotW * (slots/2) );
	 		}else {
				x0 = x - ( TVD_OPTS.SlotW * ( ( slots-1 )/2 ) );
			}
	 		return CreatePoint( x0, y0 );
	 	};

	 	var calcChildMiddleWidth = function( maxChildren ) {
	 		if( maxChildren === 0 || maxChildren === 1 ) {
	 			return 0;
			}else if( maxChildren % 2 === 0 ) {
	 			return TVD_OPTS.SlotW * ( maxChildren/2 );
	 		}else {
	 			return TVD_OPTS.SlotW * ( ( maxChildren-1 )/2 );
	 		}
	 	};

	 	var calcChildMiddleWidthRemaining = function( maxChildren ) {
	 		if( maxChildren === 0 || maxChildren === 1 ) {
	 			return TVD_OPTS.SlotW;
			}else if( maxChildren % 2 === 0 ) {
	 			return TVD_OPTS.SlotW * ( maxChildren/2 );
	 		}else {
	 			return ( TVD_OPTS.SlotW * ( ( maxChildren-1 )/2 ) ) + TVD_OPTS.SlotW;
	 		}
	 	};

	 	var drawLine = function( fromNode, toNode ) {

	 		var x1 = cssPxToNumber( fromNode.css( 'left' ) ) + TVD_OPTS.NodeWidthHalf,
	 			y1 = cssPxToNumber( fromNode.css( 'top' ) )  + TVD_OPTS.NodeHeight,
	 			x2 = cssPxToNumber( toNode.css( 'left' ) ) + TVD_OPTS.NodeWidthHalf,
	 			y2 = cssPxToNumber( toNode.css( 'top' ) );

	 		var distance = Math.sqrt( ( (x2-x1) * (x2-x1) ) + ( (y2-y1) * (y2-y1) ) );	

			// line center
		    var cx = ( (x1 + x2) / 2 ) - (distance / 2);
		    var cy = ( (y1 + y2) / 2 ) - (TVD_OPTS.LineWeight / 2);

		    var angle = Math.atan2( y1-y2, x1-x2 ) * (180/Math.PI);

		    var lineDiv = GenHtml.genLine();
		    var cssRotate = 'rotate(' + angle + 'deg)';
		    lineDiv.css( {
		    	height: 				TVD_OPTS.LineWeight,
		    	left: 					cx,
		    	top: 					cy,
		    	width:    				distance,
		    	'-moz-transform': 		cssRotate,
		    	'-webkit-transform': 	cssRotate,
		    	'-o-transform': 		cssRotate,
		    	'-ms-transform': 		cssRotate,
		    	transform: 				cssRotate
		    } );
		    addElementToRoot( lineDiv );
		    return lineDiv;
	 	};

		var addElementToRoot = function( elem ) {
			rootDom.append( elem );
		};

		var removeTreeDraw = function() {
			rootDom.empty();
		};

		var reDrawTree = function() {
			removeTreeDraw();
			TVD_OPTS.AlignTreeViewToCenter = false;
			drawTree( tree, targetSel, TVD_OPTS );
		};
		///////////////////////////////////////////////////////

		///////////////////////////////////////////////////////
		// Node menu interaction
		var addNodeMenu = function( node ) {
			var TVD_MenuTopPosition = -10;
			var TVD_MenuPaddingLeft = 3;
			var TVD_PopoverCharWidth = 9;
			var TVD_DefaultPopoverWidth = 300;

			var item = node.item
 			var iconSel = item.find( '.asttree-collapsebtn .glyphicon' );
 			var toggleCollapseNodeClass = function( toggle ) {
 				toggleClass( iconSel, 'glyphicon-menu-', 'up', 'down', toggle );
 			};

	 		var toggleCollapseNode = function() {
	 			if( hasHidenChildren( node ) ) {
	 				showRealChildren( node );
	 				toggleCollapseNodeClass( true );
	 			}else {
					hideRealChildren( node );
		 			toggleCollapseNodeClass( false );
				}
				TVD_OPTS.PreventCollapsion = true;
				reDrawTree();
				var posX = cssPxToNumber( item.css('left') );
				wrapperRootDom.scrollLeft( posX -  wrapperRootDom.width()/2 );
	 		};

 			var menuSel = item.find( '.asttree-node-menu' );
 			menuSel.css( {
 				top: 			TVD_MenuTopPosition,
 				left: 			TVD_OPTS.MenuLeftPosition,
 				'padding-left': TVD_MenuPaddingLeft
 			} );

 			var collapseBtn = menuSel.find( '.asttree-collapsebtn' );
 			if( node.isLeaf ) {
 				collapseBtn.remove();
 			} else {
	 			if( hasHidenChildren( node ) ) {
	 				toggleCollapseNodeClass( false );
	 			}
	 			collapseBtn.click( toggleCollapseNode );	
 			}

 			var srcCodeBtn = menuSel.find( '.asttree-srccodebtn' );
 			var showSrcCode = ( function() { 
 				var symbolsMap = {
 					'\t': '&nbsp;&nbsp;',
 					'\&': '&amp;',
 					'\<': '&lt;',
 					'\>': '&gt;'
 				};

	 			return function() {

	 				var astNode = node.astNode;
	 				var stringify = _.isEmpty( astNode ) ? '<Empty>' : 
	 							AstTraverse.unknown( astNode, AstStringify() );

	 				var startPos = 0;
	 				var charsWidth = 0;
	 				stringify = stringify.replace(/(\n)|(\t)|(\&)|(\<)|(\>)/g, function( match ) {
	 					if( match === '\n' ) {
	 						var currPos = arguments[3];
	 						var currCharsWidth = currPos - startPos;
	 						if( currCharsWidth > charsWidth ) {
	 							charsWidth = currCharsWidth;
	 						}
	 						startPos = currPos;
							return '<br>';
	 					}else {
	 						return symbolsMap[ match ] || '&nbsp;&nbsp;';
	 					}
					} );
					var popoverWidth = charsWidth === 0 ? TVD_DefaultPopoverWidth : charsWidth * TVD_PopoverCharWidth;
					var content = '<code style="display:block; width:' + popoverWidth + 'px; height:150px; overflow-y:scroll;">' + stringify + '</code>';
					var pooverTemplate = GenHtml.genPopover( );
	 				var popover = item.popover( {
	 					template: 	pooverTemplate,
	 					html: 		true,
	 					content: 	content,
	 					plalement: 	'auto'
	 				} );
	 			} 
 			} )();

 			srcCodeBtn.click( showSrcCode );
		};
		///////////////////////////////////////////////////////

 		/////////////////////////////////////////////////////////////////////
 		// nodes hover handler
 		var addHoverHandler = function( node ) {
			var item = node.item,
			clpsX = cssPxToNumber( item.css( 'left' ) ) + TVD_OPTS.CollapseBtnWidthOffset,
		 	clpsY = cssPxToNumber( item.css( 'top' ) ) + TVD_OPTS.CollapseBtnHeightOffset,
			childrenLines,
 			parentLines,
 			hoveredBtn,
 			menuSel,
 			stgData = getTargetItem( item ),
 			nodeNameSel = item.find( '.asttree-node-name' ),
 			nodeName;

 			//set tooltip if text node is very long
 			if( _.has( stgData, 'realName' ) ) {
 				nodeName = stgData.realName;
 			}else {
 				nodeName = nodeNameSel.text().trim();
 				stgData.realName = nodeName;
 			}
 			if( nodeName.length > TVD_OPTS.CollapseTextLength ) {
 				var collapsedText = nodeName.substr( 0, TVD_OPTS.CollapseTextLength ) + '..';
 				nodeNameSel.text( collapsedText );
 				item.tooltip( {
 					title: nodeName
 				} );
 			}else {
 				nodeNameSel.text( nodeName );
 			}

			var onHover = function() {
	 			 menuSel = item.find( '.asttree-node-menu' );

	 			 // activate menu
	 			 toggleClass( menuSel, 'asttree-node-menu-', 'active', 'simple' );

		 		// activate children edge lines
	 			childrenLines = [];
	 			tree.topDownVisitor( node, function( node ) {
					_.each( node.lines, function( line ) {
						childrenLines.push( line );
						toggleClass( line, 'asttree-line-', 'active', 'simple' );
					} );
	 			} );

	 			// activate parent edge lines
	 			parentLines = [];
	 			var targetNode = node;
	 			tree.parentToRootVisitor( node, function( parent ) {
	 				var childIndex = _.indexOf( parent.children, targetNode );
	 				ASTTreeViewDrawer_Assert( childIndex !== -1 );
	 				var line = parent.lines[ childIndex ];
	 				parentLines.push( line );
	 				toggleClass( line, 'asttree-line-', 'active', 'simple' );
					targetNode = parent;
	 			} );
			};

			var onUnhover = function() {

				// // deactivate menu
				if( menuSel ) {
					toggleClass( menuSel, 'asttree-node-menu-', 'simple', 'active' );
		 		}

				// deactivate children edge lines
				_.each( childrenLines, function( line ) {
					toggleClass( line, 'asttree-line-', 'simple', 'active' );
				} );

				// deactivate children edge lines
				_.each( parentLines, function( line ) {
					toggleClass( line, 'asttree-line-', 'simple', 'active' );
				} );
			};

			item.hover( onHover, onUnhover );		
 		};
 		/////////////////////////////////////////////////////////////////////

 		opts = _.extend( {}, defaultOptions, opts );
 		tree = targetTree;
 		rootDom = targetSel;
 		wrapperRootDom = rootDom.parent();

		///////////////////////////////////////////////////////
		// Tree draw algorithm
 		function drawNode( node, point ) {
 			var item = node.item;

			///////////////////////////////////////////////////////
			// Node drawing
 			item.css( {
 				left: 		point.x,
 				top: 		point.y,
 				width: 		TVD_OPTS.NodeWidth,
 				height: 	TVD_OPTS.NodeHeight
 			} );
 			addElementToRoot( item );
 			///////////////////////////////////////////////////////

 			addNodeMenu( node );
			addHoverHandler( node );


			///////////////////////////////////////////////////////
			// Children nodes drawing logic
 			var maxChildren = node.maxChildren;
 			if( maxChildren > 0 ) {

	 			var childStartingPosition = calcChildrenSlotsStartingPosition( point, maxChildren );
	 			var lines = node.lines = [];

	 			_.each( node.children, function( child ) {

	 				var middleWidth = calcChildMiddleWidth( child.maxChildren );
	 				childStartingPosition.x = childStartingPosition.x + middleWidth;
	 				var childPosition =  _.extend( {}, childStartingPosition ) ;
	 				drawNode( child, childPosition );

	 				var line = drawLine( item, child.item );
	 				lines.push( line );

	 				childStartingPosition.x += calcChildMiddleWidthRemaining(child.maxChildren);

	 			} );
	 		}
	 		///////////////////////////////////////////////////////
 		};
 		///////////////////////////////////////////////////////


		///////////////////////////////////////////////////////
		// draw starting point
 		changeOption( opts, false );
 		postProcessNodes( tree );
 		var startingX = calcChildMiddleWidth( tree.root.maxChildren );
		startingX += TVD_OPTS.AstViewPadding;
 		drawNode( tree.root, CreatePoint( startingX, TVD_OPTS.AstViewPadding + 60 ) );
 		var rootDomWidth = rootDom.width();
 		if( opts.AlignTreeViewToCenter ) {
	 		wrapperRootDom.scrollLeft( startingX );
	 	}
	 	rootDom.width( startingX*2 + TVD_OPTS.SlotW );
	 	/////////////////////////////////////////////////////////////////////

 		return {
 			changeOption: 	changeOption
 		};
 	};

 	return {
 		drawTree: 		drawTree
 	};

} ) );