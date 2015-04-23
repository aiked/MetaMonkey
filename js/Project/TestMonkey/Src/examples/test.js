

.& {
	var t = .< 1 + 2;  >.;
	var y = .< 1 + .~t; >.;
}

.!y;

.& var x = 1;


// y = "begin";
//.& parse( "&2;" );


// .&.& {
//  	var y  = 2;
//  	t = "staging vol.2 start";

//  	var objectx  = { testKey: "testVal" };

//  	randval = 1 + 5;

//  	var objecty  = [ 1, 4, "asd", 9 ];

//  	q = "staging vol.2 finished";
// };

//  .& if(1) {
//  	var y  = 2;
//  	t = "staging vol.1 start";

//  	var value  = "dbprint1";

//  	q = "staging vol.1 finished";

//  	var ast1 = .< if(0){ doSomething(); }; >.;
//  };

// .! ast1;



// .& if(1) {
// 	print("staging vol.1")
// }

// .&.& x = .< var stg = "stage 2"; >.;
// .&.! x;

// .& y = .< var stg = "stage 1"; >.;
// .! y;

// t = "finish";


//////////////////////////////////////
////////		simple examples


// .& {
// 	x = .<1;>.;
// 	y = .<.~x + 2;>.;                     // y is .<1 + 2>.
// 	z = .<.~x + .~y * 3;>.;                // z is .<1 + (1 + 2) * 3>.


// 	function id(x) { return Reflect.parse(x+""); }

// 	v = .<.~(id(1)) + .~(id(2));>.;        // v is .<1 + 2>.

// 	function pow(x, n) {                // will generate the AST of multiplying x with itself n times
// 	  if (n == 0)
// 	    return .<1;>.;                   // termination: just multiply with 1 (in AST form)
// 	  else
// 	    return .<.~x * .~(pow(x, n-1));>.; // recursion: multiply x with the result of the recursive invocation
// 	}
// };

// print( .!x );
// print( .!y );
// print( .!z );
// print( .!v );

// pow3 = .!pow(.<x;>., 3);               // pow3 is .<x * x * x * 1>.

// .& function ExpandPower (n, x) {                      // function is available only during compilation
//     if (n == 0)
//         return .< 1; >.;
//     else
//         return .< .~x * .~(ExpandPower(n - 1, x)) ; >.;
// };
// .& function MakePower (n) {                           // function is available only during compilation
//     return .< (
//         function (x) { return .~(ExpandPower(n, .< x; >.)); }
//     ); >.;
// };
// power3 = .!( MakePower(3) );       // generates: power3 = (function(x){ return x * x * x * 1; });
//                                 // all previous declarations never appear in the final program
// .& x = .<1;>., y = .<2;>., z = null; // x, y, z are available during compilation (compile-time state)
// .& if (1)          // the if statement is executed during compilation with all
//     z = x;                      // compile-time state being available to it
//  else                           // execute tags are also evaluated in order of appearance,
//     z = y;                      // so they provide the notion of typical control-flow

//  print( .!(z) );                    // inlines are also evaluated in order and can access compile-time state
//                                  // the generated code depends on the result of the some_condition()
//  .& print("hello");                // executed during compilation, prints 'hello' at compile-time
//  .!( .< .& print("hello"); ; >. );        // metagenerator for the above statement


//////////////////////////////////////
////////		Exception Handling

// .& function Logging (stmts)
//     { return .< try { .~stmts; } catch(e) { print(e); }; >.; }

// .& function ConstructRetry (data) {   //constructor for a custom retry policy
//     return function (stmts) {       //return a function implementing the code pattern
//         return .<                   //the returned function returns an AST
//             for (i = 0; i < .@data.attempts; ++i){
//                 try { .~stmts; break; }              //try & break loop when successful
//                 catch(e) { Sleep(.@data.delay); }    //catch & wait before retrying
// 	            if (i == .@data.attempts)              //maximum attempts were tried?
// 	                { .~data.fail; }       //then give-up & invoke failure code
// 	        }
//         >.;
//     };
// }

// .& Policies = {           //compile-time structure for holding exception policies
// 	policiesHolder: {},
//     Install: function(key, func) { this.policiesHolder[key] = func; },
//     Get: function(key) { return this.policiesHolder[key]; }
// };

// .& Policies.Install("LOG", Logging); //install the Logging policy

// .& Policies.Install("RETRY", ConstructRetry({     //create and install a retry policy
//     attempts : 5, delay : 1000, fail : .<print("FAIL");>.
// }));

//  .& policy = Policies.Get("RETRY");   
//  .!(policy( .< f(); >. ));             //Generates the code below:
// //                                 //for (i = 0; i < 5; ++i)
// //                                 //	try { f(); break;  }
// //                                 //	trap e { Sleep(1000); }
// //                                 //if (i == 5) { post("FAIL"); }
// .&policy = Policies.Get("LOG");
// .!(policy(.<g();>.));             //Generates the code below:
//                                 //try { g(); } 
//                                 //catch e { log(e); }




//////////////////////////////////////
////////		memoryManagerClass

// .& var memoryManagerClass = .<        //basic MemoryManager class implementation
// 	(function(){
// 		return {
// 			Initialize: function() {},
// 	        Cleanup: function() {},
// 	        Allocate: function(n) {},
// 	        Deallocate: function(variable) {}
// 		};
// 	})();
// >.;

// .& function GenerateMemoryManagerAsFunction() {
	
//     return {
//          defs : .< 
//         		var MemoryManager = (function() {
// 		            	var mm = null;
// 		                return function() {
// 			                if (!mm) {  //static initialization idiom
// 			                    mm = .~memoryManagerClass;
// 			                }
// 			                return mm;
// 		                };
// 		            })();
// 	        >.,
//          init : .< MemoryManager.Initialize(); >.,
//          cleanup : .< MemoryManager.Cleanup(); >.,
//          alloc: function(n) { return .< MemoryManager.Allocate( .~n ); >.; },
//          dealloc: function(variable) 
//              { return .< MemoryManager.Deallocate( .~variable ); >.;}
//     };
// };

// .& function GenerateMemoryManagerAsGlobalData(){ 
//     return {
//          defs : .< var mm = .~memoryManagerClass; >.,
//          init : .< mm.Initialize(); >.,
//          cleanup : .< mm.Cleanup(); >.,
//          alloc: function(n) { return .< mm.Allocate( .~n ); >.; },
//          dealloc: function(variable) 
//              { return .< mm.Deallocate( .~variable ); >.;}
//     };
// };

// .& var memoryManagerImplementations = {
//     func  : GenerateMemoryManagerAsFunction,
//     global: GenerateMemoryManagerAsGlobalData
// };

// .& var option = "global";                 //can also be read or computed dynamically
// .& mm = memoryManagerImplementations[ option ]();   //get the generator object

// .!( mm.defs );                 //Generates the code shown below:
//                             //mm = [
//                             //	method Initialize () {...},
//                             //	method Cleanup () {...},
//                             //	method Allocate (n) {...},
//                             //	method Deallocate (var) {...}
//                             //];
// //...other normal program definitions...
// .!(mm.init);                 //mm.Initialize();
// //...other normal program initializations...
// x = .!(mm.alloc( .<10;>. ));    //x = mm.Allocate(10);
// //...other normal program code...
// .!(mm.dealloc(.<x;>.));       //mm.Deallocate(x);
// //...other normal program cleanups...
// .!(mm.cleanup);              //mm.Cleanup();