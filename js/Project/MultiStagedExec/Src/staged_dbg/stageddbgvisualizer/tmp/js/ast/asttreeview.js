// asttreeview.js
// Library for creating a dom tree structure for each ast node
// Giannis Apostolidis
// March 2015.
//


( function( root, generators, astTreeVisitor ) {

	// Set up ast traverse appropriately for the environment. Start with AMD.
	if ( typeof define === 'function' && define.amd ) {
		define( [ 'underscore', 'jquery', 'exports' ], function( _, $, exports ) {
			// Export global even in AMD case in case this script is loaded with
			// others that may still expect a global ast traverse.
			root.Ast = root.Ast || {};
			var gen = root.Ast.GenHtml = generators( root, $ );
			var view = root.Ast.GenView = astTreeVisitor( root, gen, _, $ );
			exports = {
				GenHtml: 	gen,
				GenView: 	view
			};
		} );

	// Next for Node.js or CommonJS.
	}else if( typeof exports !== 'undefined' ) {
		var _ = require( 'underscore' );
		var $ = require( 'jquery' );
		var gen = generators( root, $ );
		exports = {
			GenHtml: 	gen,
			GenView: 	astTreeVisitor( root, gen, _, $ )
		};
	
		// Finally, as a browser global.
	}else {
		root.Ast = root.Ast || {};
		var $ = root.jQuery || root.Zepto || root.ender || root.$;
		var gen = root.Ast.GenHtml = generators( root, $ );
		root.Ast.GenView = astTreeVisitor( root, gen, root._, $ );
	}

}( this, 

///////////////////////////////////////////////////////////////////////////////
// Tree view generators
function( global, $ ) {

	var genNodeGenerator = function( className ) { 
		return function( name ) {
			name = name || '';
			var nodeHtml = 
			"<div class='" + className + "'> 		\
				" + name + "						\
			</div>";
			return $( nodeHtml );
		};
	};

	var genNodeWithMenuGenerator = function( className ) {
		return function( name ) {
			name = name || '';
			var nodeHtml = 
			"<div class='" + className + "'> 																			\
				<span class='asttree-node-name'>" + name + "	</span>													\
				<div class='asttree-node-menu asttree-node-menu-simple'>												\
	 				<button type='button' class='btn btn-default btn-xs asttree-node-menu-opt asttree-collapsebtn'>		\
	 					<span class='glyphicon glyphicon-menu-down' aria-hidden='true'></span>							\
					</button>																							\
	 				<button type='button' class='btn btn-default btn-xs asttree-node-menu-opt asttree-srccodebtn'>		\
	 					<span class='glyphicon glyphicon-file' aria-hidden='true'></span>								\
					</button>																							\
				</div>																									\
			</div>";
			return $( nodeHtml );
		}
	};

	var genPopover = function( width ) {
		return "<div class='popover' role='tooltip' style='max-width: 100%;'>						\
			<div class='arrow'></div>																\
			<h3 class='popover-title'></h3>															\
			<div class='popover-content' style='width:" + width + "px;'></div>						\
		</div>";
	};

	return {
		genExpr: 			genNodeWithMenuGenerator( 'btn btn-xs asttree-node asttree-node-expr' ),
		genStmt: 			genNodeWithMenuGenerator( 'btn btn-xs asttree-node asttree-node-stmt' ), 
		genList: 			genNodeWithMenuGenerator( 'btn btn-xs asttree-node asttree-node-list' ), 
		genVar: 			genNodeWithMenuGenerator( 'btn btn-xs asttree-node asttree-node-var' ),
		genVariant: 		genNodeWithMenuGenerator( 'btn btn-xs asttree-node asttree-node-variant' ),
		genSingleVal: 		genNodeWithMenuGenerator( 'btn btn-xs asttree-node asttree-node-singleval' ),
		genLine: 			genNodeGenerator( 'asttree-line asttree-line-simple' ),
		genPopover: 		genPopover
	};

}
///////////////////////////////////////////////////////////////////////////////

, 

///////////////////////////////////////////////////////////////////////////////
// Ast visitors
function( global, viewGens, _, $ ) {

	//////////////////////////////////////////////////////////////////////////
	// Utilities
	function ASTTreeViewException( reason ) {
		this.reason = reason;
	};

	var AstTreeView_Assert = function( cond, msg ) {
        if( !cond ) {
          	throw new ASTTreeViewException( msg );
      	}
	};

	AstTreeView_Assert( typeof viewGens === 'object', 'view generators are not included' );
	AstTreeView_Assert( typeof _ === 'function', 'underscore is not included' );
	AstTreeView_Assert(  typeof $ === 'function', 'jquery is not included' );

	var pushIfNotEmpty = function( list ) {
		_.each( arguments, function( arg ) {
			if( !_.isEmpty( arg ) ) {
				list.push( arg );
			}
		} );
		return list;
	};

	var viewGenExpr = 	viewGens.genExpr,
	viewGenStmt = 		viewGens.genStmt,
	viewGenVar = 		viewGens.genVar,
	viewGenVariant =	viewGens.genVariant,
	viewGenSingleVal = 	viewGens.genSingleVal,
	viewGenList = 		viewGens.genList;

	var visitorCallNullary = function( func ) {
		return { single: func };
	};

	var visitorCallUnary = function( beforeFunc, afterFunc ) {
		return { before: beforeFunc, after: afterFunc };
	};

	var visitorCallMulti = function( beforeFunc, afterFunc, otherFuncs ) {
		var unary = visitorCallUnary();
		return _.extend( unary, otherFuncs );
	}

	var visitorCallAfter = function( func ) {
		return { after: func };
	};

	var stringifyValue = function( val ) {

		switch( typeof val ) {
			case 'string': 
				return val;
			case 'boolean': 
				return val === true ? 'true' : 'false';
			case 'object': 
				if( _.isRegExp( val ) ) {
					return val.toString();
				}else if( val === null ) {
					return null;
				}
			case 'number':
				return val.toString();
		}
		throw new ASTTreeViewException( 
			'stringifyValue object is not regexp or null' );
	};
	//////////////////////////////////////////////////////////////////////////

	//////////////////////////////////////////////////////////////////////////
	// Tree structure

	var getNextUniqueNodeId = ( function() {
		var currId = 0;
		return function() {
			return 'treeid_' + ++currId;
		};
	} )();
	var CreateTreeNode  = function( astNode, item, children ) {
		AstTreeView_Assert( !children || ( children && _.every( children, function( child ) { 
			return !_.isEmpty( child ); 
		} ) ) );
		AstTreeView_Assert( astNode && item );
		var treeNode = {
			astNode: 	astNode,
			item: 		item,
			children: 	children,
			parent: 	undefined,
			id: 		getNextUniqueNodeId(),
			isLeaf: 	!children || _.isEmpty( children )
		};
		if( children ) {
			_.each( children, function( child ) { child.parent = treeNode; } );
		}
		return treeNode;
	};

	var CreateTree = function( root ) {

		var topDownVisitor = function( target, applier ) {

			function visitor( node ) {
				applier( node );
				var children = node.children;
				if( !_.isEmpty( children ) ) {
					_.each( children, visitor );
				}
			};
			target = target || root;
			return visitor( target );
		};

		var parentToRootVisitor = function( target, applier ) {

			function visitor( node ) {
				var parent = node.parent;
				applier( parent );
				if( parent !== root ) {
					visitor( parent );
				}
			};
			if( target !== root ) {
				visitor( target );
			}
		};

		return {
			root: 					root,
			topDownVisitor: 		topDownVisitor,
			parentToRootVisitor: 	parentToRootVisitor
		};
	};
	//////////////////////////////////////////////////////////////////////////

	//////////////////////////////////////////////////////////////////////////

	var handlerFunction = function( astNode, root, id, params, body ) {
		var paramsDiv = viewGenList( 'Args' );
		var paramsNode = CreateTreeNode( astNode.params, paramsDiv, params );

		var children = pushIfNotEmpty( [], id, paramsNode, body );
		return CreateTreeNode( astNode, root, children );
	};

	var handlerLiteral = visitorCallNullary( function( lit, val ) {
		var node = viewGenSingleVal( stringifyValue( val ) );
		return CreateTreeNode( lit, node );
	} );

	var handlerProperty = visitorCallAfter( 
		function( prop, bef, key, aftKey, value ) {
			var node = viewGenVariant( 'Property' );
			return CreateTreeNode( prop, node, [ key, value ] );
		} 
	);

	var handlerIdentifier = visitorCallNullary( function( indent, val ) {
		var node = viewGenSingleVal( stringifyValue( val ) );
		return CreateTreeNode( indent, node );
	} );
	
	var handlerPattern = visitorCallNullary( function( patt, type, val ) {
		var node = viewGenSingleVal( stringifyValue( val ) );
		return CreateTreeNode( patt, node );
	} );

	var handlerVariableDeclarator = visitorCallAfter( 
		function( varDeclar, bef, id, aftId, init ) {
			var node = viewGenVar( 'var' );
			var children = pushIfNotEmpty( [], id, init );
			return CreateTreeNode( varDeclar, node, children );
		} 
	);

	var handlerCatchClause = visitorCallAfter( 
		function( catchClause, bef, pattern, aftPattern, guard, aftGuard, block ) {
			var node = viewGenVariant( 'Catch' );
			var children = pushIfNotEmpty( [], pattern, guard, block );
			return CreateTreeNode( catchClause, node, children );
		} 
	);


	var handlerSwitchCase = visitorCallAfter( 
		function( cas, bef, test, aftTest, consequent ) {
			var node = viewGenVariant( 'Case' );
			var consequentDiv = viewGenList( 'consequent' );
			var consequentNode = CreateTreeNode( cas.consequent, consequentDiv, consequent );
			var children = pushIfNotEmpty( [], test, consequentNode );
			return CreateTreeNode( cas, node, children );
		} 
	);


	//////////////////////////////////////////////////////////////////////////
	// Expresssion visitors

	var handlerGenExprUnaryExpr = function( name ) {
		return visitorCallAfter( function( expr, bef, op, arg ) {
			var node = viewGenExpr( name );
			var opNode;
			if( op ) {
				if( _.has( expr, 'prefix' ) ) {
					op = expr.prefix ? op + '* ' : '* ' + op ;
				}
				var opDiv = viewGenSingleVal( op  );
				var opNode = CreateTreeNode( expr.argument, opDiv );
			}
			var children = pushIfNotEmpty( [], opNode, arg );
			return CreateTreeNode( expr, node, children );
		} );
	};

	var handlerExprThis = visitorCallNullary( function( expr ) {
		var node = viewGenExpr( 'This' );
		return CreateTreeNode( expr, node );
	} );

	var handlerExprArray = visitorCallAfter( 
		function( expr, bef, elements ) {
			var node = viewGenExpr( 'Array' );
			if( elements ) {
				return CreateTreeNode( expr, node, elements );
			}else {
				return CreateTreeNode( expr, node );
			}
		} 
	);

	var handlerExprObject = visitorCallAfter( 
		function( expr, bef, properties ) {
			var node = viewGenExpr( 'Object' );
			if( _.isEmpty( properties ) ) {
				return CreateTreeNode( expr, node );
			}else {
				return CreateTreeNode( expr, node, properties );
			}
		} 
	);

	var handlerExprFunction = visitorCallAfter( 
		function( expr, bef, id, aftId, params, aftParams, body ) {
			var node = viewGenExpr( 'Function' );
			return handlerFunction( expr, node, id, params, body );
		} 
	);

	var handlerExprSequence = visitorCallAfter( 
		function( expr, bef, expressions ) {
			var node = viewGenExpr( 'Sequence' );
			return CreateTreeNode( expr, node, expressions );
		} 
	);

	var handlerExprUnary = handlerGenExprUnaryExpr( 'Unary' );

	var handlerExprBinaryLeftRight = visitorCallAfter( 
		function( expr, bef, left, aftLeft, right ) {
			var node = viewGenExpr( expr.operator );
			return CreateTreeNode( expr, node, [ left, right ] );
		} 
	);

	var handlerExprAssignment = handlerExprBinaryLeftRight;

	var handlerExprUpdate = handlerGenExprUnaryExpr( 'Update' );

	var handlerExprBinary = handlerExprBinaryLeftRight;

	var handlerExprLogical = handlerExprBinaryLeftRight;

	var handlerExprConditional = visitorCallAfter( 
		function( expr, bef, test, aftTest, alternate, aftAlternate, consequent ) {
			var node = viewGenExpr( 'conditional' );
			return CreateTreeNode( expr, node, [ test, alternate, consequent ] );
		}
	);

	var handlerExprCalleeArgs = function( name ) {
		return visitorCallAfter( 
			function( expr, bef, callee, aftCallee, args ) {
				var node = viewGenExpr( name );
				var argsRoot = viewGenList( 'Args' );
				var argsNode = CreateTreeNode( expr.arguments, argsRoot, args );
				return CreateTreeNode( expr, node, [ callee, argsNode ] );
			}
		);
	};

	var handlerExprNew = handlerExprCalleeArgs( 'New' );

	var handlerExprCall = handlerExprCalleeArgs( 'Call' );

	var handlerExprMember = visitorCallAfter( 
		function( expr, bef, obj, aftObj, prop ) {
			var node = viewGenExpr( 'Member' );
			return CreateTreeNode( expr, node, [ obj, prop ] );
		}
	);

	///////////////////////////////////////////////////////////////////////////



	//////////////////////////////////////////////////////////////////////////
	// Statement visitors

	var handlerStmtEmpty = visitorCallNullary( function( stmt ) {
		var node = viewGenStmt( 'Empty' );
		return CreateTreeNode( stmt, node );
	} );

	var handlerStmtBlock = visitorCallAfter( 
		function( stmt, bef, stmtsRet ) {
			var node = viewGenStmt( '{}' );
			return CreateTreeNode( stmt, node, stmtsRet );
		} 
	);

	var handlerStmtExpr = visitorCallAfter( 
		function( stmt, bef, expr ) {
			var node = viewGenStmt( 'Expr' );
			return CreateTreeNode( stmt, node, [ expr ] );
		} 
	);

	var handlerStmtIf = visitorCallAfter( 
		function( stmt, bef, testRet, aftTest, consRet, aftCons, altRet ) {
			var node = viewGenStmt( 'If' );
			var children = pushIfNotEmpty( [], testRet, consRet, altRet );
			return CreateTreeNode( stmt, node, children );
		} 
	);

	var handlerStmtLabeled = visitorCallAfter( 
		function( stmt, bef, ident, aftIdent, bodyRet ) {
			var node = viewGenStmt( 'Labeled' );
			return CreateTreeNode( stmt, node, [ ident, bodyRet ] );
		} 
	);

	var handlerGenStmtUnaryIdent = function( name ) {
		return visitorCallAfter( function( stmt, bef, ident ) {
			var node = viewGenStmt( name );
			if( ident ) {
				return CreateTreeNode( stmt, node, [ ident ] );
			}else {
				return CreateTreeNode( stmt, node );
			}
		} ); 
	};

	var handlerStmtBreak = handlerGenStmtUnaryIdent( 'Break' );

	var handlerStmtContinue = handlerGenStmtUnaryIdent( 'Continue' );

	var handlerStmtSwitch = visitorCallAfter( 
		function( stmt, bef, discr, aftDiscr, cases ) {
			var node = viewGenStmt( 'Switch' );
			var casesDiv = viewGenList( 'cases' );
			var casesNode = CreateTreeNode( stmt.cases, casesDiv, cases );
			return CreateTreeNode( stmt, node, [ discr, casesNode ] );
		} 
	);

	var handlerStmtReturn = visitorCallAfter( 
		function( stmt, bef, argRet ) {
			var node = viewGenStmt( 'Return' );
			if( argRet ) {
				return CreateTreeNode( stmt, node, [ argRet ] );
			}else {
				return CreateTreeNode( stmt, node );
			}
		} 
	);

	var handlerStmtThrow = visitorCallAfter( 
		function( stmt, bef, argRet ) {
			var node = viewGenStmt( 'Throw' );
			return CreateTreeNode( stmt, node, [ argRet ] );
		} 
	);

	var handlerStmtTry = visitorCallAfter( 
		function( stmt, bef, block, afterBlock, handler, afterhandler, finalizer ) {
			var node = viewGenStmt( 'Try' );
			var children = pushIfNotEmpty( [], block, handler, finalizer );
			return CreateTreeNode( stmt, node, children );
		} 
	);

	var handlerStmtWhile = visitorCallAfter( 
		function( stmt, bef, test, afterTest, body ) {
			var node = viewGenStmt( 'While' );
			return CreateTreeNode( stmt, node, [ test, body ] );
		} 
	);

	var handlerStmtDoWhile = visitorCallAfter( 
		function( stmt, bef, test, afterTest, body ) {
			var node = viewGenStmt( 'Do While' );
			return CreateTreeNode( stmt, node, [ test, body ] );
		} 
	);

	var handlerStmtFor = visitorCallAfter( 
		function( stmt, bef,  init, afterInit, test, afterTest, 
				 update, afterUpdate, body 
	 	) {
			var node = viewGenStmt( 'For' );
			var children = pushIfNotEmpty( [], init, test, update, body );
			return CreateTreeNode( stmt, node, children );
		} 
	);

	var handlerStmtForIn = visitorCallAfter( 
		function( stmt, bef, left, afterLeft, right, body ) {
			var node = viewGenStmt( 'For In' );
			var children = pushIfNotEmpty( [], left, right, body );
			return CreateTreeNode( stmt, node, children );
		} 
	);

	var handlerStmtDebugger  = visitorCallNullary( function( stmt ) {
		var node = viewGenStmt( 'Debugger' );
		return CreateTreeNode( stmt, node );
	} );

	var handlerStmtDeclFunction = visitorCallAfter( 
		function( stmt, bef, id, aftId,  params, aftParams, body ) {
			var node = viewGenStmt( 'Function' );
			return handlerFunction( stmt, node, id, params, body );
		} 
	);

	var handlerStmtDeclVariable = visitorCallAfter( 
		function( stmt, bef, declarations ) {
			var node = viewGenStmt( 'Var decl' );
			return CreateTreeNode( stmt, node, declarations );
		} 
	);
	//////////////////////////////////////////////////////////////////////////



	var handlerProgram = visitorCallUnary( 
		undefined,
		function( ast, bef, stmts ) {
			var node = viewGenStmt( 'program' );
			var root = CreateTreeNode( ast, node, stmts );
			return CreateTree( root );
		} 
	);

	return {
		literal: 			handlerLiteral,
		property: 			handlerProperty,
		identifier: 		handlerIdentifier,
		pattern: 			handlerPattern,
		variableDeclarator: handlerVariableDeclarator,
		catchClause: 		handlerCatchClause,
		switchCase:			handlerSwitchCase,

		exprThis: 			handlerExprThis,
		exprArray: 			handlerExprArray,
		exprObject: 		handlerExprObject,
		exprFunction: 		handlerExprFunction,
		exprSequence: 		handlerExprSequence,
		exprUnary:  		handlerExprUnary,
		exprAssignment: 	handlerExprAssignment,
		exprUpdate:  		handlerExprUpdate,
		exprBinary: 		handlerExprBinary,
		exprLogical: 		handlerExprLogical,
		exprConditional: 	handlerExprConditional,
		exprNew: 			handlerExprNew,
		exprCall: 			handlerExprCall,
		exprMember:      	handlerExprMember,

		stmtEmpty: 			handlerStmtEmpty,
		stmtBlock: 			handlerStmtBlock,
		stmtExpr: 			handlerStmtExpr,
		stmtIf: 			handlerStmtIf,
		stmtLabeled:		handlerStmtLabeled,
		stmtBreak:			handlerStmtBreak,
		stmtContinue:		handlerStmtContinue,
		stmtSwitch:			handlerStmtSwitch,
		stmtReturn: 		handlerStmtReturn,
		stmtThrow: 			handlerStmtThrow,
		stmtTry: 			handlerStmtTry,
		stmtWhile: 			handlerStmtWhile,
		stmtDoWhile: 		handlerStmtDoWhile,
		stmtFor: 			handlerStmtFor,
		stmtForIn: 			handlerStmtForIn,
		stmtDebugger: 		handlerStmtDebugger,

		stmtDeclFunction:  	handlerStmtDeclFunction,
		stmtDeclVariable: 	handlerStmtDeclVariable,

		program: 			handlerProgram

	};

}

) );