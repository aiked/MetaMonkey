// asttreeview.js
// Library for creating a dom tree structure for each ast node
// Giannis Apostolidis
// March 2015.
//


( function( root, factory ) {

	// Set up ast traverse appropriately for the environment. Start with AMD.
	if ( typeof define === 'function' && define.amd ) {
		define( [ 'underscore', 'exports' ], function( _, exports ) {
			// Export global even in AMD case in case this script is loaded with
			// others that may still expect a global ast traverse.
			root.Ast = root.Ast || {};
			return root.Ast.Stringify = exports = factory( root, _ );
		} );

	// Next for Node.js or CommonJS.
	}else if( typeof exports !== 'undefined' ) {
		var _ = require( 'underscore' );
		exports = factory( root, _ );
	
		// Finally, as a browser global.
	}else {
		root.Ast = root.Ast || {};
		root.Ast.Stringify = factory( root, root._ );
	}

}( this, function( global, _ ) {


	function ASTTreeStringifyException( reason ) {
		this.reason = reason;
	};

	var ASTTreeStringify_Assert = function( cond, msg ) {
        if( !cond ) {
          	throw new ASTTreeStringifyException( msg );
      	}
	};

	ASTTreeStringify_Assert( typeof _ === 'function', 'underscore is not included' );


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

	var whiteSpacesWrap = function( func ) {
		return function() {
			var str = func.apply( this, arguments );
			return '%tb%s;\n'.format( this.tabs(), str );
		};
	};

	var whiteSpacesNotSemiWrap = function( func ) {
		return function() {
			var str = func.apply( this, arguments );
			return '%tb%s\n'.format( this.tabs(), str );
		};
	};

	var visitorStmtCallNullary = function( func ) {
		return { single: whiteSpacesWrap( func ) };
	};

	var visitorStmtCallAfter = function( func ) {
		return { after: whiteSpacesWrap( func ) };
	};

	var visitorStmtNotSemiCallAfter = function( func ) {
		return { after: whiteSpacesNotSemiWrap( func ) };
	};



	String.prototype.format = ( function() {

		var formats = {
			'%s': function( str ) {
				return _.isString( str ) ? str : '';
			},

			'%tb' : function( num ) {
				var tabs = '';
				_( num ).times( function() {
					tabs += '\t';
				} );
				return tabs;
			}
		};

		var callFormat = function( type, arg ) {
			return formats[ type ]( arg );
		};

		return 	function() {
			var args = arguments;
			var currArg = -1;

			return this.replace(/(%s)|(%tb)/g, function( match ) {
				return callFormat( match, args[ ++currArg ] );
			} );
		};

	} )();


	var stringifyValue = function( val, quoteString ) {

		switch( typeof val ) {
			case 'string': 
				return quoteString ? "'" + val + "'" : val;
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

	var handlerFunction = function( node, id, params, body ) {
		if( id ) {
			id = ' ' + id;
		}
		return 'function%s(%s) %s'.format( id, params.join(','), body );
	};

	var handlerLiteral = visitorCallNullary( function( lit, val ) {
		return stringifyValue( val, true );
	} );

	var handlerProperty = visitorCallAfter( 
		function( prop, bef, key, aftKey, value ) {
			return '%s: %s'.format( key, value );
		} 
	);

	var handlerIdentifier = visitorCallNullary( function( indent, val ) {
		return stringifyValue( val );
	} );
	
	var handlerPattern = visitorCallNullary( function( patt, type, val ) {
		return stringifyValue( val );
	} );

	var handlerVariableDeclarator = visitorCallAfter( 
		function( varDeclar, bef, id, aftId, init ) {
			var str = '%s';
			if( init ) {
				str += ' = %s';
			}
			return str.format( id, init );
		} 
	);

	var handlerCatchClause = visitorCallAfter( 
		function( catchClause, bef, pattern, aftPattern, guard, aftGuard, block ) {
			return 'catch(%s) %s'.format( pattern, block );
		} 
	);

	var handlerSwitchCase = visitorCallAfter( 
		function( cas, bef, test, aftTest, consequent ) {
			if( !test ) {
				test = 'default';
			}
			return '%tb%s: %s\n'.format( this.tabs(), test, consequent.join('') );
		} 
	);


	//////////////////////////////////////////////////////////////////////////
	// Expresssion visitors

	var handlerGenExprUnaryExpr = function( space ) {
		var spaceStr = space ? ' ' : '';
		return visitorCallAfter( function( expr, bef, op, arg ) {
			var str;
			if( expr.prefix ) {
				str = '%s%s%s'.format( op, spaceStr, arg );
			}else {
				str = '%s%s%s'.format( arg, spaceStr, op );
			}
			return str;
		} );
	};

	var handlerExprThis = visitorCallNullary( function( expr ) {
		return 'this';
	} );

	var handlerExprArray = visitorCallAfter( 
		function( expr, bef, elements ) {
			if( elements ) {
				return '[ %s ]'.format( elements.join( ', ' ) );
			}else {
				return '[]';
			}
			
		} 
	);

	var handlerExprObject = visitorCallAfter( 
		function( expr, bef, properties ) {
			if( properties ) {
				return '{ %s }'.format( properties.join( ', ' ) );
			}else {
				return '{}';
			}
			
		} 
	);

	var handlerExprFunction = visitorCallAfter( 
		function( node, bef, id, aftId, params, aftParams, body ) {
			return handlerFunction( node, id, params, body );
		} 
	);

	var handlerExprSequence = visitorCallAfter( 
		function( expr, bef, expressions ) {
			return expressions.join( ', ' );
		} 
	);

	var handlerExprUnary = handlerGenExprUnaryExpr( true );

	var handlerExprBinaryLeftRight = visitorCallAfter( 
		function( expr, bef, left, aftLeft, right ) {
			return '(%s %s %s)'.format( left, expr.operator, right );
		} 
	);

	var handlerExprAssignment = handlerExprBinaryLeftRight;

	var handlerExprUpdate = handlerGenExprUnaryExpr( false );

	var handlerExprBinary = handlerExprBinaryLeftRight;

	var handlerExprLogical = handlerExprBinaryLeftRight;

	var handlerExprConditional = visitorCallAfter( 
		function( expr, bef, test, aftTest, alternate, aftAlternate, consequent ) {
			return '%s ? %s : %s'.format( test, alternate, consequent );
		}
	);

	var handlerExprNew = visitorCallAfter( 
		function( expr, bef, callee, aftCallee, args ) {
			var argsStr = args.join( ',' );
			return 'new %s(%s)'.format( callee, argsStr );
		}
	);

	var handlerExprCall = visitorCallAfter( 
		function( expr, bef, callee, aftCallee, args ) {
			var argsStr = args.join( ',' );
			return '%s(%s)'.format( callee, argsStr );
		}
	);

	var handlerExprMember = visitorCallAfter( 
		function( expr, bef, obj, aftObj, prop ) {
			if( expr.computed ) {
				return '%s[%s]'.format( obj, prop );
			}else {
				return '%s.%s'.format( obj, prop );
			}
		}
	);

	var handlerExprMetaQuazi = visitorCallAfter( 
		function( expr, bef, stmts ) {
			return '.< %s >.'.format( stmts.join( '' ) );
		}
	);

	var handlerExprMetaExec = visitorCallAfter( 
		function( expr, bef, stmt ) {
			return '.& { %s }'.format( stmt );
		}
	);

	///////////////////////////////////////////////////////////////////////////



	//////////////////////////////////////////////////////////////////////////
	// Statement visitors

	var handlerStmtEmpty = visitorStmtCallNullary( function( stmt ) {
		return '';
	} );

	var handlerStmtBlock = visitorCallUnary( 
		function( stmt ) {
			this.raiseTabs();
		},
		function( stmt, bef, stmtsRet ) {
			var tabs = this.decrTabs();
			return '{\n%s%tb}'.format( stmtsRet.join( '' ), tabs );
		}
	);

	var handlerStmtExpr = visitorStmtCallAfter( 
		function( stmt, bef, expr ) {
			return expr;
		} 
	);

	var handlerStmtIf = visitorStmtNotSemiCallAfter( 
		function( stmt, bef, testRet, aftTest, consRet, aftCons, altRet ) {
			var ifStr = 'if(%s) %s';
			if( altRet ) {
				ifStr += 'else %s';
			}
			return ifStr.format( testRet, consRet, altRet );
		} 
	);

	var handlerStmtLabeled = visitorCallAfter( 
		function( stmt, bef, ident, aftIdent, bodyRet ) {
			return '%s: \n%s'.format( ident, bodyRet );
		} 
	);

	var handlerGenStmtUnaryIdent = function( name ) {
		return visitorStmtCallAfter( function( stmt, bef, ident ) {
			return name;
		} ); 
	};

	var handlerStmtBreak = handlerGenStmtUnaryIdent( 'break' );

	var handlerStmtContinue = handlerGenStmtUnaryIdent( 'continue' );

	var handlerStmtSwitch = visitorCallUnary( 
		function( stmt ) {
			this.raiseTabs();
		},
		whiteSpacesWrap( function( stmt, bef, discr, aftDiscr, cases ) {
			var tabs = this.decrTabs();
			return 'switch(%s) {\n%s%tb}'.format( discr, cases.join( '' ), tabs );
		} )
	);

	var handlerStmtReturn = visitorStmtCallAfter( 
		function( stmt, bef, argRet ) {
			return 'return %s'.format( argRet );
		} 
	);

	var handlerStmtThrow = visitorStmtCallAfter( 
		function( stmt, bef, argRet ) {
			return 'throw %s'.format( argRet );
		} 
	);

	var handlerStmtTry = visitorStmtCallAfter( 
		function( stmt, bef, block, afterBlock, handler, afterhandler, finalizer ) {
			if( finalizer ) {
				finalizer = 'finally %s'.format( finalizer ); 
			}
			return 'try %s %s'.format( block, handler, finalizer );
		} 
	);

	var handlerStmtWhile = visitorStmtCallAfter( 
		function( stmt, bef, test, afterTest, body ) {
			return 'while(%s) %s'.format( test, body );
		} 
	);

	var handlerStmtDoWhile = visitorCallAfter( 
		function( stmt, bef, test, afterTest, body ) {
			return ( 'Do While' );
		} 
	);

	var handlerStmtFor = visitorStmtCallAfter( 
		function( stmt, bef,  init, afterInit, test, afterTest, 
				 update, afterUpdate, body 
	 	) {
			return 'for(%s;%s;%s) %s'.format( init, test, update, body );
		} 
	);

	var handlerStmtForIn = visitorStmtCallAfter( 
		function( stmt, bef, left, afterLeft, right, body ) {
			return 'for(%s in %s) %s'.format( left, right, body );
		} 
	);

	var handlerStmtDebugger  = visitorStmtCallNullary( function( stmt ) {
		return 'debugger';
	} );

	var handlerStmtDeclFunction = visitorStmtCallAfter( 
		function( node, bef, id, aftId,  params, aftParams, body ) {
			return handlerFunction( node, id, params, body );
		} 
	);

	var handlerStmtDeclVariable = visitorStmtCallAfter( 
		function( stmt, bef, declarations ) {
			return 'var %s'.format( declarations.join(', ') );
		} 
	);
	//////////////////////////////////////////////////////////////////////////

	var handlerProgram = visitorCallUnary( 
		undefined,
		function( ast, bef, stmts ) {
			return stmts.join( '' );
		} 
	);

	var CreateStringifyOptions = function() {
		return {
			tab: 	0
		};
	};

	return function() {

		var raiseTabs = function() {
			ASTTreeStringify_Assert( this.opts.tab >= 0 );
			return ++this.opts.tab;
		};

		var decrTabs = function() {
			ASTTreeStringify_Assert( this.opts.tab > 0 );
			return --this.opts.tab;
		};

		var tabs = function() {
			var tabs = this.opts.tab;
			ASTTreeStringify_Assert( tabs >=0 );
			return tabs;
		}

		var opts = CreateStringifyOptions();
		return {
			opts: 				opts,
			raiseTabs: 			raiseTabs,
			decrTabs: 			decrTabs,
			tabs: 				tabs,

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

			exprMetaQuazi:		handlerExprMetaQuazi,
			exprMetaExec:		handlerExprMetaExec,

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
	};

} ) );