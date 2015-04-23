// asttreeviewwithoptions.js
// Library for drawing a tree view and some options for it. 
// Giannis Apostolidis
// March 2015.
//

( function( root, factory ) {

	// Set up ast traverse appropriately for the environment. Start with AMD.
	if ( typeof define === 'function' && define.amd ) {
		define( [ 'underscore', 'jquery', 'asttraverse', 'asttreeview', 
					'optionsgenerator', 'asttreeviewdraw', 'asttreestringify', 'exports' 
		], function( _, $, astTraverse, astView, optionGen, astViewDraw, astStringify, exports ) {
				// Export global even in AMD case in case this script is loaded with
				// others that may still expect a global ast traverse.
				root.Ast = root.Ast || {};
				root.Ast.DrawTreeWithOpt = exports = 
					factory( root, _, $, astTraverse, astView.GenView, optionGen, astViewDraw, astStringify );
			} 
		);

	// Next for Node.js or CommonJS.
	}else if( typeof exports !== 'undefined' ) {
		var _ = require( 'underscore' );
		var $ = require( 'jquery' );
		var astTraverse = require( 'asttraverse' );
		var astView = require( 'asttreeview' );
		var optionGen = require( 'optionsgenerator' );
		var astViewDraw = require( 'asttreeviewdraw' );
		var astStringify = require( 'asttreestringify' );
		exports = factory( root, _, $, astTraverse, astView.GenView, optionGen, astViewDraw, astStringify );
	
		// Finally, as a browser global.
	}else {
		root.Ast = root.Ast || {};
		var $ = root.jQuery || root.Zepto || root.ender || root.$;
		var astTraverse = root.Ast.Traverse;
		var GenView = root.Ast.GenView;
		var optionGen = root.Ast.OptionsGen;
		var astViewDraw = root.Ast.DrawTree;
		var astStringify = root.Ast.Stringify;
		root.Ast.DrawTreeWithOpt = 
			factory( root, root._, $, astTraverse, GenView, optionGen, astViewDraw, astStringify );
	}

}( this, function( global, _, $, astTraverse, GenView, optionGen, astViewDraw, astStringify  ) {


	// if(true){ t=8; }else{ z=9 }
	//var ast = ({loc:null, type:"Program", body:[{loc:null, type:"IfStatement", test:{loc:null, type:"Literal", value:true}, consequent:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"t"}, right:{loc:null, type:"Literal", value:8}}}]}, alternate:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"z"}, right:{loc:null, type:"Literal", value:9}}}]}}]});

	//function foo(a){ print(2); } if(foo(4)){ x=4; x+=1; }
	//var ast = ({loc:null, type:"Program", body:[{loc:null, type:"FunctionDeclaration", id:{loc:null, type:"Identifier", name:"foo"}, params:[{loc:null, type:"Identifier", name:"a"}], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:[{loc:null, type:"Literal", value:2}]}}]}, rest:null, generator:false, expression:false}, {loc:null, type:"IfStatement", test:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"foo"}, arguments:[{loc:null, type:"Literal", value:4}]}, consequent:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"x"}, right:{loc:null, type:"Literal", value:4}}}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"+=", left:{loc:null, type:"Identifier", name:"x"}, right:{loc:null, type:"Literal", value:1}}}]}, alternate:null}]});

	// x = 2;
	//var ast = {loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"x"}, right:{loc:null, type:"Literal", value:2}}}]};

	// print( 1 + 2 )
	//var ast = ({loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:[{loc:null, type:"BinaryExpression", operator:"+", left:{loc:null, type:"Literal", value:1}, right:{loc:null, type:"Literal", value:2}}]}}]});

	// while(p(2)){ i++; }
	//var ast = ({loc:null, type:"Program", body:[{loc:null, type:"WhileStatement", test:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"p"}, arguments:[{loc:null, type:"Literal", value:2}]}, body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"UpdateExpression", operator:"++", argument:{loc:null, type:"Identifier", name:"i"}, prefix:false}}]}}]});

	// new tt(1,2);
	//var ast = ({loc:null, type:"Program", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"NewExpression", callee:{loc:null, type:"Identifier", name:"tt"}, arguments:[{loc:null, type:"Literal", value:1}, {loc:null, type:"Literal",value:2}]}}]});

	// for(t=0;i<10;++i){ t = 1/7; }
	// var ast = ({loc:null, type:"Program", body:[{loc:null, type:"ForStatement", init:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier",name:"t"}, right:{loc:null, type:"Literal", value:0}}, test:{loc:null, type:"BinaryExpression", operator:"<", left:{loc:null, type:"Identifier", name:"i"}, right:{loc:null, type:"Literal", value:10}}, update:{loc:null, type:"UpdateExpression", operator:"++", argument:{loc:null, type:"Identifier", name:"i"}, prefix:true}, body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"t"}, right:{loc:null, type:"BinaryExpression",operator:"/", left:{loc:null, type:"Literal", value:1}, right:{loc:null, type:"Literal", value:7}}}}]}}]});

	// var t=0; for( t in y ){ debugger; }
	//var ast = ({loc:null, type:"Program", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"t"}, init:{loc:null, type:"Literal", value:0}}, {loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"y"}, init:{loc:null, type:"Literal", value:0}}]}, {loc:null, type:"ForInStatement", left:{loc:null, type:"Identifier", name:"t"}, right:{loc:null, type:"Identifier", name:"y"}, body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"DebuggerStatement"}]}, each:false}]});

	// for(;;){ break; continue; } switch(e){ case 1: break; }
	//var ast = ({loc:null, type:"Program", body:[{loc:null, type:"ForStatement", init:null, test:null, update:null, body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"BreakStatement", label:null}, {loc:null, type:"ContinueStatement", label:null}]}}, {loc:null, type:"SwitchStatement", discriminant:{loc:null, type:"Identifier", name:"e"}, cases:[{loc:null, type:"SwitchCase", test:{loc:null, type:"Literal", value:1}, consequent:[{loc:null, type:"BreakStatement", label:null}]}], lexical:false}]});

	// function print(){return 1;} try{ throw new Exception();} catch(e){ print(e); }
	//var ast = ({loc:null, type:"Program", body:[{loc:null, type:"FunctionDeclaration", id:{loc:null, type:"Identifier", name:"print"}, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ReturnStatement", argument:{loc:null, type:"Literal", value:1}}]}, rest:null, generator:false, expression:false}, {loc:null, type:"TryStatement", block:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ThrowStatement", argument:{loc:null, type:"NewExpression", callee:{loc:null, type:"Identifier", name:"Exception"}, arguments:[]}}]}, guardedHandlers:[], handler:{loc:null, type:"CatchClause", param:{loc:null, type:"Identifier", name:"e"}, guard:null, body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:[{loc:null, type:"Identifier", name:"e"}]}}]}}, finalizer:null}]});


	// var myVeryVeryVeryVeryBigVariable = (function(){ t=this; return t; }); var myar=[1,2], myar2=[], myobj={}, myobj2={a:1,'t':'6'}; print(1), print(2); var p = myobj2.a
	var ast = ({loc:null, type:"Program", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"myVeryVeryVeryVeryBigVariable"}, init:{loc:null, type:"FunctionExpression", id:null, params:[], defaults:[], body:{loc:null, type:"BlockStatement", body:[{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"AssignmentExpression", operator:"=", left:{loc:null, type:"Identifier", name:"t"}, right:{loc:null, type:"ThisExpression"}}}, {loc:null, type:"ReturnStatement", argument:{loc:null, type:"Identifier", name:"t"}}]}, rest:null, generator:false, expression:false}}]}, {loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"myar"}, init:{loc:null, type:"ArrayExpression", elements:[{loc:null, type:"Literal", value:1}, {loc:null, type:"Literal", value:2}]}}, {loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"myar2"}, init:{loc:null, type:"ArrayExpression", elements:[]}}, {loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"myobj"}, init:{loc:null, type:"ObjectExpression", properties:[]}}, {loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"myobj2"}, init:{loc:null, type:"ObjectExpression", properties:[{loc:null, type:"Property", key:{loc:null, type:"Identifier", name:"a"}, value:{loc:null, type:"Literal", value:1}, kind:"init"}, {loc:null, type:"Property", key:{loc:null, type:"Literal", value:"t"}, value:{loc:null, type:"Literal", value:"6"}, kind:"init"}]}}]}, {loc:null, type:"ExpressionStatement", expression:{loc:null, type:"SequenceExpression", expressions:[{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:[{loc:null, type:"Literal", value:1}]}, {loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:[{loc:null, type:"Literal", value:2}]}]}}, {loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"p"}, init:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"myobj2"}, property:{loc:null, type:"Identifier", name:"a"}, computed:false}}]}]});
	var ast = window.TARGET_AST || ast;
	// var t = 1 ? 't' : q;  ; var t = p.a.w.q, t = p['a'][w].q; if( 2 || ( 4*4 ) && ( 8 + 1) )print(err)
	//var ast = ({loc:null, type:"Program", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"t"}, init:{loc:null, type:"ConditionalExpression", test:{loc:null, type:"Literal", value:1}, consequent:{loc:null, type:"Literal", value:"t"}, alternate:{loc:null, type:"Identifier", name:"q"}}}]}, {loc:null, type:"EmptyStatement"}, {loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"t"}, init:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression",object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier",name:"p"}, property:{loc:null, type:"Identifier", name:"a"}, computed:false}, property:{loc:null, type:"Identifier", name:"w"}, computed:false}, property:{loc:null, type:"Identifier", name:"q"}, computed:false}}, {loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"t"}, init:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"MemberExpression", object:{loc:null, type:"Identifier", name:"p"}, property:{loc:null, type:"Literal", value:"a"}, computed:true}, property:{loc:null, type:"Identifier", name:"w"}, computed:true}, property:{loc:null, type:"Identifier", name:"q"}, computed:false}}]}, {loc:null, type:"IfStatement", test:{loc:null, type:"LogicalExpression", operator:"||", left:{loc:null, type:"Literal", value:2},right:{loc:null, type:"LogicalExpression", operator:"&&", left:{loc:null, type:"BinaryExpression", operator:"*", left:{loc:null, type:"Literal", value:4}, right:{loc:null, type:"Literal", value:4}}, right:{loc:null, type:"BinaryExpression", operator:"+", left:{loc:null, type:"Literal", value:8}, right:{loc:null, type:"Literal", value:1}}}}, consequent:{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:[{loc:null, type:"Identifier", name:"err"}]}}, alternate:null}]});

	// if( (1*(2+3))/4 + 5 ) print(err);
	//var ast = ({loc:null, type:"Program", body:[{loc:null, type:"IfStatement", test:{loc:null, type:"BinaryExpression", operator:"+", left:{loc:null, type:"BinaryExpression", operator:"/", left:{loc:null, type:"BinaryExpression", operator:"*", left:{loc:null, type:"Literal", value:1}, right:{loc:null, type:"BinaryExpression", operator:"+", left:{loc:null, type:"Literal", value:2}, right:{loc:null, type:"Literal", value:3}}}, right:{loc:null, type:"Literal", value:4}}, right:{loc:null, type:"Literal", value:5}}, consequent:{loc:null, type:"ExpressionStatement", expression:{loc:null, type:"CallExpression", callee:{loc:null, type:"Identifier", name:"print"}, arguments:[{loc:null, type:"Identifier", name:"err"}]}}, alternate:null}]});

	var drawTreeWithOpt = function() {

		var drawTree, drawOptions;
		var optsValues = {};

		var genOptNum = function( label, name, val ) {
			optsValues[ name ] = val;
			return {
				type: 		'number',
				label: 		label,
				name: 		name,
				val: 		val,
				onChange: 	function( opt, val ) {
					var evt = {};
					evt[ name ] = val;
					drawTree.changeOption( evt, true );
				}
			}
		};

		var genOptRange = function( label, name, val, min, max, step ) {
			optsValues[ name ] = val;
			return {
				type: 		'slider',
				label: 		label,
				name: 		name,
				val: 		val,
				min: 		min,
				max: 		max,
				step: 		step,
				onChange: 	function( opt, val ) {
					var evt = {};
					evt[ name ] = val;
					drawTree.changeOption( evt, true );
				}
			}
		};

		var collapseOptions = function( opt, val ) {
			if( val === 'hide' ) {
				drawOptions.hide( 'optCanvas' );
				drawOptions.hide( 'optTree' );
				opt.setVal( 'show' );
			}else {
				drawOptions.show( 'optCanvas' );
				drawOptions.show( 'optTree' );
				opt.setVal( 'hide' );
			}
		};

		var collapseOptionsBtn = {
			type: 			'button',
			label: 			'Options',
			name: 			'stgoptions',
			kind: 			'link',
			val: 			'hide',
			onChange: 	function( opt, val ) {
				collapseOptions( opt, val );
			}
		};

		var opts = [
			collapseOptionsBtn,

			{
				type: 			'fieldset',
				label: 			'Canvas',
				name: 			'optCanvas',
				children: [
					genOptNum( 'View height', 'ViewHeight', 400 )
				]
			},

			{
				type: 			'fieldset',
				label: 			'Tree',
				name: 			'optTree',
				children: [
					genOptRange( 'Width', 				'NodeWidth', 				80, 30, 150, 1 ),
					genOptRange( 'Height', 				'NodeHeight', 				20, 5, 150, 1 ),
					genOptRange( 'Width gap', 			'NodeGapWidth', 			28, 5, 150, 1 ),
					genOptRange( 'Height gap', 			'NodeGapHeight',			25, 5, 150, 1 ),
					genOptRange( 'Line weight', 		'LineWeight', 				1, 1, 20, 1 ),
					genOptRange( 'Ast view padding', 	'AstViewPadding', 			30, 0, 150, 1 ),
					genOptRange( 'Node name max length','CollapseTextLength', 		9, 1, 100, 1 )
				]
			}
		];

		var domtree = astTraverse.program( ast, GenView );

		drawOptions = optionGen.drawOptions( $( '#astview-container .astopts' ), opts );
		var stgOpt = drawOptions.get( 'stgoptions' );
		collapseOptions( stgOpt, 'hide' );

		drawTree = astViewDraw.drawTree( domtree, $( '#astview-container .astview' ), optsValues );

		var stringify = astTraverse.program( ast, astStringify() );

		return {
			domtree: 		domtree,
			drawTree: 		drawTree,
			drawOptions: 	drawOptions,
			src: 	 		stringify
		};
	};

	return drawTreeWithOpt;

} ) );
