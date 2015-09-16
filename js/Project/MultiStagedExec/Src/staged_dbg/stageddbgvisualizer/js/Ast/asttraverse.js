// asttraverse.js
// Library for traversing an ast object, 
// as defined in mozilla SpiderMonkey Parser API, 
// and apply a user function in each node
// Giannis Apostolidis
// March 2015.
//

/*
	visitor calls:

	node type | function call
	nullary -> single,
	unary -> before, after
	more than 1, multi -> before, callA, afterA, callB, afterB, after
	
*/
( function( root, factory ) {

	// Set up ast traverse appropriately for the environment. Start with AMD.
	if ( typeof define === 'function' && define.amd ) {
		define( [ 'underscore', 'exports' ], function( _, exports ) {
			// Export global even in AMD case in case this script is loaded with
			// others that may still expect a global ast traverse.
			root.Ast = root.Ast || {};
			return root.Ast.Traverse = exports = factory( root, _ );
		} );

	// Next for Node.js or CommonJS.
	}else if( typeof exports !== 'undefined' ) {
		var _ = require( 'underscore' );
		exports = factory( root, _ );

		// Finally, as a browser global.
	}else {
		root.Ast = root.Ast || {};
		root.Ast.Traverse = factory( root, root._ );
	}

}( this, function( root, _ ) {

	function ASTTraverseException( reason ) {
		this.reason = reason;
	};

	function ASTTraverseGrammarException( reason ) {
		this.reason = reason;
	};

	var TRVS_Assert = function( cond, msg ) {
        if( !cond ) {
          	throw new ASTTraverseException( msg );
      	}
	};

	var TRVS_GrammarCheckCond = function( cond ) {
        if( !cond ) {
          	throw new ASTTraverseGrammarException( msg );
      	}
	};

	var TRVS_GrammarCheck = function() {
		var targetObj = arguments[0];
		for( var i = arguments.length - 1; i !== 0; --i ) {
			if( !_.has( targetObj, arguments[ i ] ) ) {
				throw new ASTTraverseGrammarException();
			}
		}
	};

	TRVS_Assert( typeof _ === 'function', 'underscore is not included' );

	var TRVS_Get = function( obj, key ) {
		TRVS_GrammarCheck( obj, key );
		return obj[key];
	};

	var trvsCallVisitor = function( visitor, type, action ) {
		if( visitor ) {
			var typeVal = visitor[ type ];
			if( typeVal ) {
				TRVS_Assert( _.isObject( typeVal ) );
				var actionVal = typeVal[ action ];
				if( actionVal ) {
					TRVS_Assert( _.isFunction( actionVal ) );
					return actionVal.apply( visitor, _.toArray( arguments ).slice( 3 ) );
				}
			}
		}
	};



	///////////////////////////////////////////////////////////////////////////
	//							Variants

	var trvsLiteral = function( lit, visitor ) {
		TRVS_GrammarCheck( lit, 'value' );
		return trvsCallVisitor( visitor, 'literal', 'single', lit, lit.value );
	};

	var trvsProperty = function( prop, visitor ) {
		TRVS_GrammarCheck( prop, 'value', 'key' );
		var bef = trvsCallVisitor( visitor, 'property', 'before', prop );

		var keyVal = prop.key,
			key;
		try {
			key = trvsLiteral( keyVal, visitor );
		}catch( e ) {
			key = trvsIdentifier( keyVal, visitor );
		}
		var aftKey = trvsCallVisitor( visitor, 'property', 'afterKey', prop, bef, key );

		var value = trvsCallExpr( prop.value, visitor );
		return trvsCallVisitor( visitor, 'property', 'after', prop, bef, 
								key, aftKey, value );
	};

	var trvsProperties = function( props, visitor ) {
		TRVS_GrammarCheckCond( _.isArray( props ) );
		return _.map( props, function( prop ) {
			return trvsProperty( prop, visitor );
		} );
	};

	var trvsCatchClause = function( catchClause, visitor ) {
		TRVS_GrammarCheck( catchClause, 'param', 'body' );
		var bef = trvsCallVisitor( visitor, 'catchClause', 'before', catchClause );

		var pattern = trvsPattern( catchClause.param, visitor );
		var aftPattern = trvsCallVisitor( visitor, 'catchClause', 'afterPattern', catchClause, bef, 
											pattern );

		var guard = _.isEmpty( catchClause.test ) ? null : trvsCallExpr( catchClause.guard, visitor );
		var aftGuard = trvsCallVisitor( visitor, 'catchClause', 'afterGuard', catchClause, bef, 
										pattern, aftPattern, guard );

		var block = trvsStmtBlock( catchClause.body, visitor );
		return trvsCallVisitor( visitor, 'catchClause', 'after', catchClause, bef, 
								pattern, aftPattern, guard, aftGuard, block );
	};

	var trvsSwitchCase = function( cas, visitor ) {
		TRVS_GrammarCheck( cas, 'consequent' );
		var bef = trvsCallVisitor( visitor, 'switchCase', 'before', cas );

		var test =  _.isEmpty( cas.test ) ? null : trvsCallExpr( cas.test, visitor );
		var aftTest = trvsCallVisitor( visitor, 'switchCase', 'afterTest', cas, bef, test );

		var consequent = trvsStmts( cas.consequent, visitor );
		return trvsCallVisitor( visitor, 'switchCase', 'after', cas, bef, test, aftTest, 
								consequent );
	};

	var trvsSwitchCases = function( cases, visitor ) {
		TRVS_GrammarCheckCond( _.isArray( cases ) );
		return _.map( cases, function( cas ) {
			return trvsSwitchCase( cas, visitor );
		} );
	};

	var trvsIdentifier = function( indent, visitor ) {
		TRVS_GrammarCheck( indent, 'name' );
		return trvsCallVisitor( visitor, 'identifier', 'single', indent, indent.name );
	};

	var trvsPattern = function( patt, visitor ) {
		TRVS_GrammarCheck( patt, 'type', 'name' );
		return trvsCallVisitor( visitor, 'pattern', 'single', patt, patt.type, patt.name );
	};

	var trvsPatterns = function( patts, visitor ) {
		TRVS_GrammarCheckCond( _.isArray( patts ) );
		return _.map( patts, function( patt ) {
			return trvsPattern( patt, visitor );
		} );
	};

	var trvsVariableDeclarator = function( varDeclar, visitor ) {
		TRVS_GrammarCheck( varDeclar, 'id' );
		var bef = trvsCallVisitor( visitor, 'variableDeclarator', 'before', varDeclar );

		var id = trvsPattern( varDeclar.id, visitor );
		var aftId = trvsCallVisitor( visitor, 'variableDeclarator', 'afterId', varDeclar, bef, id );

		var init = _.isEmpty( varDeclar.init ) ? null : trvsCallExpr(  varDeclar.init, visitor );
		return trvsCallVisitor( visitor, 'variableDeclarator', 'after', varDeclar, 
								bef, id, aftId, init );
	};

	var trvsVariableDeclarators = function( varDeclars, visitor ) {
		TRVS_GrammarCheckCond( _.isArray( varDeclars ) );
		return _.map( varDeclars, function( varDeclar ) {
			return trvsVariableDeclarator( varDeclar, visitor );
		} );
	};

	var trvsFunction = function( node, visitorName, bef, visitor ) {
		TRVS_GrammarCheck( node, 'params', 'body' );
		var id = _.isEmpty( node.id ) ? null : trvsIdentifier( node.id, visitor );
		var aftId = trvsCallVisitor( visitor, visitorName, 'afterId', node, bef, id );

		var params = trvsPatterns( node.params, visitor );
		var aftParams = trvsCallVisitor( visitor, visitorName, 'afterParams', node, 
										bef, id, aftId, params );

		var bodyVal = node.body,
			body;

		try{ 
			body = trvsStmtBlock( bodyVal, visitor );
		}catch( e ) {
			body = trvsCallExpr( bodyVal, visitor );
		} 

		return trvsCallVisitor( visitor, visitorName, 'after', node, bef, 
								id, aftId, params, aftParams, body );
	};


	///////////////////////////////Variants/////////////////////////////////////


	///////////////////////////////////////////////////////////////////////////
	//							Expressions
	var trvsExprThis = function( expr, visitor ) {
		TRVS_GrammarCheckCond( _.isObject( expr ) );
		return trvsCallVisitor( visitor, 'exprThis', 'single', expr );
	};

	var trvsExprArray = function( expr, visitor ) {
		TRVS_GrammarCheckCond( _.isObject( expr ) );
		var bef = trvsCallVisitor( visitor, 'exprArray', 'before', expr );
		var elements = _.isEmpty( expr.elements ) ? null : trvsExprs( expr.elements, visitor );
		return trvsCallVisitor( visitor, 'exprArray', 'after', expr, bef, elements );
	};

	var trvsExprObject = function( expr, visitor ) {
		TRVS_GrammarCheck( expr, 'properties' );
		var bef = trvsCallVisitor( visitor, 'exprObject', 'before', expr );
		var properties = trvsProperties( expr.properties, visitor );
		return trvsCallVisitor( visitor, 'exprObject', 'after', expr, bef, properties );
	};

	var trvsExprFunction = function( expr, visitor ) {
		TRVS_GrammarCheckCond( _.isObject( expr ) );
		var bef = trvsCallVisitor( visitor, 'exprFunction', 'before', expr );
		return trvsFunction( expr, 'exprFunction', bef, visitor );
	};

	var trvsExprSequence = function( expr, visitor ) {
		TRVS_GrammarCheck( expr, 'expressions' );
		var bef = trvsCallVisitor( visitor, 'exprSequence', 'before', expr );
		var expressions = trvsExprs( expr.expressions, visitor );
		return trvsCallVisitor( visitor, 'exprSequence', 'after', expr, bef, expressions );
	};

	var trvsGenExprUnaryExpr = function( visitorName ) {
		return function( expr, visitor ) {
			TRVS_GrammarCheck( expr, 'argument', 'prefix', 'operator' );
			var bef = trvsCallVisitor( visitor, visitorName, 'before', expr );
			var arg = trvsCallExpr( expr.argument, visitor );
			return trvsCallVisitor( visitor, visitorName, 'after', expr, 
									bef, expr.operator, arg );
		};
	}

	var trvsExprUnary = trvsGenExprUnaryExpr( 'exprUnary' );

	var trvsGenExprBinaryLeftRight = function( visitorName ) {
		return function( expr, visitor ) {
			TRVS_GrammarCheck( expr, 'left', 'right' );
			var bef = trvsCallVisitor( visitor, visitorName, 'before', expr );

			var left = trvsCallExpr( expr.left, visitor );
			var aftLeft = trvsCallVisitor( visitor, visitorName, 'afterLeft', expr, bef, left );

			var right = trvsCallExpr( expr.right, visitor );
			return trvsCallVisitor( visitor, visitorName, 'after', expr, bef, left, aftLeft, right );
		};
	};

	var trvsExprBinary = trvsGenExprBinaryLeftRight( 'exprBinary' );

	var trvsExprAssignment = trvsGenExprBinaryLeftRight( 'exprAssignment' ); 

	var trvsExprUpdate = trvsGenExprUnaryExpr( 'exprUpdate' );					

	var trvsExprLogical = trvsGenExprBinaryLeftRight( 'exprLogical' ); 

	var trvsExprConditional = function( expr, visitor ) {
		TRVS_GrammarCheck( expr, 'test', 'alternate', 'consequent' );
		var bef = trvsCallVisitor( visitor, 'exprConditional', 'before', expr );

		var test = trvsCallExpr( expr.test, visitor );
		var aftTest = trvsCallVisitor( visitor, 'exprConditional', 'afterTest', 
									expr, bef, test );

		var alternate = trvsCallExpr( expr.alternate, visitor );
		var aftAlternate = trvsCallVisitor( visitor, 'exprConditional', 'afterAlternate', 
									expr, bef, test, aftTest, alternate );

		var consequent = trvsCallExpr( expr.consequent, visitor );
		return trvsCallVisitor( visitor, 'exprConditional', 'after', 
									expr, bef, test, aftTest, alternate, aftAlternate, consequent );
	};

	var tvrsGenExprCalleeArgs = function( visitorName ) {
		return function( expr, visitor ) {
			TRVS_GrammarCheck( expr, 'callee', 'arguments' );
			var bef = trvsCallVisitor( visitor, visitorName, 'before', expr );

			var callee = trvsCallExpr( expr.callee, visitor );
			var aftCallee = trvsCallVisitor( visitor, visitorName, 'afterCallee', 
										expr, bef, callee );

			var args = trvsExprs( expr.arguments, visitor );
			return trvsCallVisitor( visitor, visitorName, 'after', 
										expr, bef, callee, aftCallee, args );
		};
	};

	var trvsExprNew = tvrsGenExprCalleeArgs( 'exprNew' );

	var trvsExprCall = tvrsGenExprCalleeArgs( 'exprCall' );

	var trvsExprMember = function( expr, visitor ) {
		TRVS_GrammarCheck( expr, 'object', 'property' );
		var bef = trvsCallVisitor( visitor, 'exprMember', 'before', expr );

		var obj = trvsCallExpr( expr.object, visitor );
		var aftObj = trvsCallVisitor( visitor, 'exprMember', 'afterObject', 
									expr, bef, obj );

		var propVal = expr.property,
			prop;
		try{
			prop = trvsIdentifier( propVal, visitor );
		}catch( e ) {
			prop = trvsCallExpr( propVal, visitor );
		}
		return trvsCallVisitor( visitor, 'exprMember', 'after', 
								expr, bef, obj, aftObj, prop );
	};

	var trvsStmtMetaQuazi = function( expr, visitor ) {
		TRVS_GrammarCheck( expr, 'body' );
		var bef = trvsCallVisitor( visitor, 'exprMetaQuazi', 'before', expr );
		var stmtsRet = trvsStmts( expr.body, visitor );
		return trvsCallVisitor( visitor, 'exprMetaQuazi', 'after', 
								expr, bef, stmtsRet );
	};

	var trvsStmtMetaExec = function( expr, visitor ) {
		TRVS_GrammarCheck( expr, 'body' );
		var bef = trvsCallVisitor( visitor, 'exprMetaExec', 'before', expr );
		var stmtRet = trvsCallStmt( expr.body, visitor );
		return trvsCallVisitor( visitor, 'exprMetaExec', 'after', 
								expr, bef, stmtRet );
	};
	//////////////////////Expressions///////////////////////////////



	///////////////////////////////////////////////////////////////////////////
	//					Expressions dispatching
	var trvsCallExpr = ( function() {
		var exprsMap = {
			Literal:  					trvsLiteral,
			Identifier:  				trvsIdentifier,

			ThisExpression: 			trvsExprThis,
			ArrayExpression: 			trvsExprArray,
			ObjectExpression: 			trvsExprObject,
			FunctionExpression: 		trvsExprFunction,
			SequenceExpression: 		trvsExprSequence,
			UnaryExpression: 			trvsExprUnary,
			BinaryExpression: 			trvsExprBinary,
			AssignmentExpression: 		trvsExprAssignment,
			UpdateExpression: 			trvsExprUpdate,
			LogicalExpression: 			trvsExprLogical,
			ConditionalExpression: 		trvsExprConditional,
			NewExpression: 				trvsExprNew,
			CallExpression: 			trvsExprCall,
			MemberExpression:  			trvsExprMember,

			MetaQuaziStatement: 		trvsStmtMetaQuazi,
			MetaExecStatement: 			trvsStmtMetaExec
		};
		return function( expr, visitor ) {
			var exprFunc = TRVS_Get( exprsMap, expr.type );
			return exprFunc.call( undefined, expr, visitor ); 
		};
	} )();

	var trvsExprs = function( exprs, visitor ) {
		return _.map( exprs, function( expr ) {
			return trvsCallExpr( expr, visitor );
		} );
	};
	////////////////////////Expressions dispatching/////////////////////////////


	///////////////////////////////////////////////////////////////////////////
	//							Statements

	var trvsStmtEmpty = function( stmt, visitor ) {
		TRVS_GrammarCheckCond( _.isObject( stmt ) );
		return trvsCallVisitor( visitor, 'stmtEmpty', 'single', stmt );
	};

	var trvsStmtBlock = function( stmt, visitor ) {
		TRVS_GrammarCheck( stmt, 'body' );
		var bef = trvsCallVisitor( visitor, 'stmtBlock', 'before', stmt );
		var stmtsRet = trvsStmts( stmt.body, visitor );
		return trvsCallVisitor( visitor, 'stmtBlock', 'after', stmt, bef, stmtsRet );
	};

	var trvsStmtExpr = function( stmt, visitor ) {
		TRVS_GrammarCheck( stmt, 'expression' );
		var bef = trvsCallVisitor( visitor, 'stmtExpr', 'before', stmt );
		var expr = trvsCallExpr( stmt.expression, visitor );
		return trvsCallVisitor( visitor, 'stmtExpr', 'after', stmt, bef, expr );
	};

	var trvsStmtIf = function( stmt, visitor ) {
		TRVS_GrammarCheck( stmt, 'test', 'consequent' );
		var bef = trvsCallVisitor( visitor, 'stmtIf', 'before', stmt );

		var testRet = trvsCallExpr( stmt.test, visitor );
		var aftTest = trvsCallVisitor( visitor, 'stmtIf', 'afterTest', stmt, bef, testRet );

		var consRet = trvsCallStmt( stmt.consequent, visitor );
		var aftCons = trvsCallVisitor( visitor, 'stmtIf', 'afterCons', stmt, 
										bef, testRet, aftTest, consRet );

		var altRet = _.isEmpty( stmt.alternate ) ? null : trvsCallStmt( stmt.alternate, visitor );
		return trvsCallVisitor( visitor, 'stmtIf', 'after', stmt, bef, testRet, 
								aftTest, consRet, aftCons, altRet );
	};

	var trvsStmtLabeled = function( stmt, visitor ) {
		TRVS_GrammarCheck( stmt, 'label', 'body' );
		var bef = trvsCallVisitor( visitor, 'stmtLabeled', 'before', stmt );

		var ident = trvsIdentifier( stmt.label, visitor );
		var aftIdent = trvsCallVisitor( visitor, 'stmtLabeled', 'afterLabel', stmt, bef, ident );

		var bodyRet = trvsCallStmt( stmt.body, visitor );
		return trvsCallVisitor( visitor, 'stmtLabeled', 'after', stmt, bef, 
								ident, aftIdent, bodyRet );
	};

	var trvsGenStmtUnaryIdent = function( visitorName ) {
		return function( stmt, visitor ) {
			TRVS_GrammarCheckCond( _.isObject( stmt ) );
			var bef = trvsCallVisitor( visitor, visitorName, 'before', stmt );
			var ident = _.isEmpty( stmt.label ) ? null : trvsIdentifier( stmt.label, visitor );
			return trvsCallVisitor( visitor, visitorName, 'after', stmt, bef, ident );
		};
	};

	var trvsStmtBreak = trvsGenStmtUnaryIdent( 'stmtBreak' );

	var trvsStmtContinue = trvsGenStmtUnaryIdent( 'stmtContinue' ); 

	var trvsStmtSwitch = function( stmt, visitor ) {
		TRVS_GrammarCheck( stmt, 'discriminant', 'cases' );
		var bef = trvsCallVisitor( visitor, 'stmtSwitch', 'before', stmt );

		var discr = trvsCallExpr( stmt.discriminant, visitor );
		var aftDiscr = trvsCallVisitor( visitor, 'stmtSwitch', 'afterDiscr', stmt, bef, discr );

		var cases = trvsSwitchCases( stmt.cases, visitor );
		return trvsCallVisitor( visitor, 'stmtSwitch', 'after', stmt, bef, 
										discr, aftDiscr, cases );
	};

	var trvsStmtReturn = function( stmt, visitor ) {
		TRVS_GrammarCheckCond( _.isObject( stmt ) );
		var bef = trvsCallVisitor( visitor, 'stmtReturn', 'before', stmt );
		var argRet = _.isEmpty( stmt.argument ) ? null : trvsCallExpr( stmt.argument, visitor );
		return trvsCallVisitor( visitor, 'stmtReturn', 'after', stmt, bef, argRet );
	};

	var trvsStmtThrow = function( stmt, visitor ) {
		TRVS_GrammarCheck( stmt, 'argument' );
		var bef = trvsCallVisitor( visitor, 'stmtThrow', 'before', stmt );
		var argRet = trvsCallExpr( stmt.argument, visitor );
		return trvsCallVisitor( visitor, 'stmtThrow', 'after', stmt, bef, argRet );
	};

	var trvsStmtTry = function( stmt, visitor ) {
		TRVS_GrammarCheck( stmt, 'block' );
		var bef = trvsCallVisitor( visitor, 'stmtTry', 'before', stmt );

		var block = trvsStmtBlock( stmt.block, visitor );
		var afterBlock = trvsCallVisitor( visitor, 'stmtTry', 'afterBlock', stmt, bef, block );

		var handler = _.isEmpty( stmt.handler ) ? null : trvsCatchClause( stmt.handler, visitor );
		var afterhandler = trvsCallVisitor( visitor, 'stmtTry', 'afterHandler', 
											stmt, bef, block, afterBlock, handler );

		var finalizer = _.isEmpty( stmt.finalizer ) ? null : trvsStmtBlock( stmt.finalizer, visitor );
		return trvsCallVisitor( visitor, 'stmtTry', 'after', stmt, bef, block, afterBlock, 
										handler, afterhandler, finalizer );
	};

	var trvsGenStmtWhile = function( visitorName ) {
		return function( stmt, visitor ) {
			TRVS_GrammarCheck( stmt, 'test', 'body' );
			var bef = trvsCallVisitor( visitor, visitorName, 'before', stmt );

			var test = trvsCallExpr( stmt.test, visitor );
			var afterTest = trvsCallVisitor( visitor, visitorName, 'afterTest', stmt, bef, test );

			var body = trvsCallStmt( stmt.body, visitor );
			return trvsCallVisitor( visitor, visitorName, 'after', stmt, bef, test, afterTest, body );
		};
	};

	var trvsStmtWhile = trvsGenStmtWhile( 'stmtWhile' );

	var trvsStmtDoWhile = trvsGenStmtWhile( 'stmtDoWhile' );

	var trvsStmtFor = function( stmt, visitor ) {
		TRVS_GrammarCheck( stmt, 'body' );
		var bef = trvsCallVisitor( visitor, 'stmtFor', 'before', stmt );

		var initVal = stmt.init, 
			init;
		if( initVal === null ) {
			init = null;
		}else {
			try {
				init = trvsStmtDeclVariable( initVal, visitor );
			}catch(e) {
				init = trvsCallExpr( initVal, visitor );
			}
		}	
		var afterInit = trvsCallVisitor( visitor, 'stmtFor', 'afterInit', stmt, bef, init );

		var test = _.isEmpty( stmt.test ) ? null : trvsCallExpr( stmt.test, visitor );
		var afterTest = trvsCallVisitor( visitor, 'stmtFor', 'afterTest', stmt, bef, 
										init, afterInit, test );

		var update = _.isEmpty( stmt.update ) ? null : trvsCallExpr( stmt.update, visitor );
		var afterUpdate = trvsCallVisitor( visitor, 'stmtFor', 'afterUpdated', stmt, bef, 
									init, afterInit, test, afterTest, update );

		var body = trvsCallStmt( stmt.body, visitor );
		return trvsCallVisitor( visitor, 'stmtFor', 'after', stmt, bef,  init, afterInit, 
								test, afterTest, update, afterUpdate, body );
	};

	var trvsStmtForIn = function( stmt, visitor ) {
		TRVS_GrammarCheck( stmt, 'left', 'right', 'body' );
		var bef = trvsCallVisitor( visitor, 'stmtForIn', 'before', stmt );
		var leftVal = stmt.left, 
			left;
		try {
			left = trvsStmtDeclVariable( leftVal, visitor );
		}catch(e) {
			left = trvsCallExpr( leftVal, visitor );
		}
		var afterLeft = trvsCallVisitor( visitor, 'stmtForIn', 'afterLeft', stmt, bef, left );

		var right = trvsCallExpr( stmt.right, visitor );
		var afterRight = trvsCallVisitor( visitor, 'stmtForIn', 'afterRight', stmt, bef, left, afterLeft, right );

		var body = trvsCallStmt( stmt.body, visitor );
		return trvsCallVisitor( visitor, 'stmtForIn', 'after', stmt, bef, left, afterLeft, right, body );
	};

	var trvsStmtDebugger = function( stmt, visitor ) {
		TRVS_GrammarCheckCond( _.isObject( stmt ) );
		return trvsCallVisitor( visitor, 'stmtDebugger', 'single', stmt );
	};

	var trvsStmtDeclFunction = function( stmt, visitor ) {
		TRVS_GrammarCheckCond( _.isObject( stmt ) );
		var bef = trvsCallVisitor( visitor, 'stmtDeclFunction', 'before', stmt );
		return trvsFunction( stmt, 'stmtDeclFunction', bef, visitor );
	};

	var trvsStmtDeclVariable = function( stmt, visitor ) {
		TRVS_GrammarCheck( stmt, 'declarations' );
		var bef = trvsCallVisitor( visitor, 'stmtDeclVariable', 'before', stmt );
		var declarations = trvsVariableDeclarators( stmt.declarations, visitor );
		return trvsCallVisitor( visitor, 'stmtDeclVariable', 'after', stmt, bef, declarations );
	};		

	//////////////////////////////Statements////////////////////////////////////


	///////////////////////////////////////////////////////////////////////////
	//					Statements dispatching
	var trvsCallStmt = ( function() {

		var stmtsMap = {
			EmptyStatement: 			trvsStmtEmpty,
			BlockStatement: 			trvsStmtBlock,
			ExpressionStatement: 		trvsStmtExpr,
			IfStatement: 				trvsStmtIf,
			LabeledStatement: 			trvsStmtLabeled,
			BreakStatement: 			trvsStmtBreak,
			ContinueStatement: 			trvsStmtContinue,
			SwitchStatement: 			trvsStmtSwitch,
			ReturnStatement: 			trvsStmtReturn,
			ThrowStatement: 			trvsStmtThrow,
			TryStatement: 				trvsStmtTry,
			WhileStatement: 			trvsStmtWhile,
			DoWhileStatement: 			trvsStmtDoWhile,
			ForStatement: 				trvsStmtFor,
			ForInStatement: 			trvsStmtForIn,
			DebuggerStatement: 			trvsStmtDebugger,

			FunctionDeclaration: 		trvsStmtDeclFunction,
			VariableDeclaration: 		trvsStmtDeclVariable
		};
		return function( stmt, visitor ) {
			var stmtFunc = TRVS_Get( stmtsMap, stmt.type );
			return stmtFunc.call( undefined, stmt, visitor ); 
		};
	} )();

	var trvsStmts = function( stmts, visitor ) {
		TRVS_GrammarCheckCond( _.isArray( stmts ) );
		return _.map( stmts, function( stmt ) {
			return trvsCallStmt( stmt, visitor );
		} );
	};

	////////////////////////Statements dispatching/////////////////////////////



	var trvsProgram = function( ast, visitor ) {
		TRVS_GrammarCheck( ast, 'body' );
		var bef = trvsCallVisitor( visitor, 'program', 'before' );
		var stmts = trvsStmts( ast.body, visitor );
		return trvsCallVisitor( visitor, 'program', 'after', ast, bef, stmts );
	};

	var trvsUnknown = ( function() {
		var nodeTypes = {
			VariableDeclarator:  		trvsVariableDeclarator,
			Property: 					trvsProperty,

			EmptyStatement: 			trvsStmtEmpty,
			BlockStatement: 			trvsStmtBlock,
			ExpressionStatement: 		trvsStmtExpr,
			IfStatement: 				trvsStmtIf,
			LabeledStatement: 			trvsStmtLabeled,
			BreakStatement: 			trvsStmtBreak,
			ContinueStatement: 			trvsStmtContinue,
			SwitchStatement: 			trvsStmtSwitch,
			ReturnStatement: 			trvsStmtReturn,
			ThrowStatement: 			trvsStmtThrow,
			TryStatement: 				trvsStmtTry,
			WhileStatement: 			trvsStmtWhile,
			DoWhileStatement: 			trvsStmtDoWhile,
			ForStatement: 				trvsStmtFor,
			ForInStatement: 			trvsStmtForIn,
			DebuggerStatement: 			trvsStmtDebugger,

			FunctionDeclaration: 		trvsStmtDeclFunction,
			VariableDeclaration: 		trvsStmtDeclVariable,

			Literal:  					trvsLiteral,
			Identifier:  				trvsIdentifier,

			ThisExpression: 			trvsExprThis,
			ArrayExpression: 			trvsExprArray,
			ObjectExpression: 			trvsExprObject,
			FunctionExpression: 		trvsExprFunction,
			SequenceExpression: 		trvsExprSequence,
			UnaryExpression: 			trvsExprUnary,
			BinaryExpression: 			trvsExprBinary,
			AssignmentExpression: 		trvsExprAssignment,
			UpdateExpression: 			trvsExprUpdate,
			LogicalExpression: 			trvsExprLogical,
			ConditionalExpression: 		trvsExprConditional,
			NewExpression: 				trvsExprNew,
			CallExpression: 			trvsExprCall,
			MemberExpression:  			trvsExprMember,

			MetaQuaziStatement: 		trvsStmtMetaQuazi,
			MetaExecStatement: 			trvsStmtMetaExec,

			Program: 					trvsProgram
		};
		return function( node, visitor ) {
			var func = TRVS_Get( nodeTypes, node.type );
			return func.call( undefined, node, visitor ); 
		};
	} )();

	return {
		program: 		trvsProgram,
		stmts:   		trvsStmts,
		stmt: 			trvsCallStmt,
		exprs: 			trvsExprs,
		expr: 			trvsCallExpr,
		unknown: 		trvsUnknown
	};
	
} ) );


