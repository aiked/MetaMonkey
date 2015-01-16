// function test() {
// 	return .< print(); >.;
// }


//.&.& x = 1;


//.&.& z;
//.!.< t( 1,.~test(),2 ); >.;
// .&.& x=2;
// .&.&.& x=1 ;
// .& .& .!x;
// .& .& .!(y+x);
// .&.& x=1; ;
// .&.! x ;
// .& x=1 ;
// .! x ;
// .& y=1 ;
// .!y;
// .&.!.<2;>.;


 .& x = .< 1; >.;
 .! x;

// .& 1; ;
// t(.!x, .&.!x2;, .!x3);
// .&.!y;
// ;
// .!y2;
// if(1)
// 	.!w;
// !.!z;




// .& x = 1;
// {
// 	loc: null,
// 	type: "Program",
// 	body: [{
//         loc: null,
//         type: "ExpressionStatement",
//         expression: {
// 			loc: null,
// 			type: "MetaExecStatement",
// 			body: {
// 				loc: null,
// 				type: "ExpressionStatement ", 
// 	              	expression:{
// 	              	loc:null, 
// 	              	type:"AssignmentExpression ", 
// 	              	operator:" = ", 
// 	              	left:{
// 	              		loc: null,
// 	              		type: "Identifier",
// 	              		name: "x"
// 	           		},
// 	       		  	right: {
// 						loc: null,
// 						type: "Literal",
// 						value: 0
// 	           		}
//         		}	
//      		}
//   		}
//   	}]
// }

// .&.& x=1 ;
// {
//   loc: null,
//   type: "Program",
//   body: [{
//         loc: null,
//         type: "ExpressionStatement",
//         expression: {
//            loc: null,
//            type: "MetaExecStatement",
//            body: {
//               loc: null,
//               type: "ExpressionStatement ", 
//               expression:{
//               	loc:null, 
//               	type:"MetaExecStatement ", 
//               	body:{
//               		loc:null,
//               		type:"ExpressionStatement ", 
//               		expression:{
//               			loc:null, 
//               			type:"AssignmentExpression ", 
//               			operator:" = ",
// 	                  left: {
// 	                     loc: null,
// 	                     type: "Identifier",
// 	                     name: "x"
// 	                  },
// 	                  right: {
// 	                     loc: null,
// 	                     type: "Literal",
// 	                     value: 1
// 	                  }
//            }
//         }
//      }
//   }
// }
// }]
// }

// .&1
// .!1
// .&.&2
// .&.!2

// {loc:null, type:"EmptyStatement"}

// int depth = 0;
// while(1) {
// 	JSObject *tmpNode;
// 	//ExpressionStatement -> MetaExecStatement | body
// 	if( AstObjMng::isMetaExecStmt(cx, node, &node, &tmpNode) )
// 		return JS_FALSE;

// 	if(!tmpNode){

// 		JSObject *nodeBody;
// 		if( AstObjMng::isSpecificUnaryExpr(cx, node, ".!", &nodeBody) )
// 			return JS_FALSE;

// 		if( nodeBody ) {
// 			stages.add( depth, t_inln, node );
// 		}else if( depth > 0 ) {
// 			stages.add( depth - 1, t_exec, node );
// 		}
// 		break;
// 	}
// 	node = tmpNode;
// 	++depth;
// }




