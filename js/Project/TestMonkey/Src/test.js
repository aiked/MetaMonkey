//function foo2(){ return .< q; z; >.; } a = .! .< function foo(){ x; y; .~foo2() }; >.;

//function foo2(){ return .< q; z+q; >.; } 
//a = .! .< function foo(){ x; y; .~foo2() }; >.;

//x = .~foo2();

function gen2(){
	multi = .< q; z; >.;
	single = .< q; >.;
	stmts = .< if(debug) console.log(':)'); while(1)break; >.;
	op = .< x; >.;
	op2 = .< 4; >.;
	op3 = .< 1+y; >.;

	multiFunc = .< function foo8(){ x; .~multi; y; .~single; }; >.;
	multiFunc2 = .< function foo29(){ .~multi; }; >.;
	singleFunc = .< function foo00(){ 2; .~single; }; >.;

	singleExpr = .< print(3, .~single); >.;
	multiExpr = .< print(.~multi, 3); >.;

	return [

		.< var tt = .~op + .~op3; .~stmts; .~multiFunc; >.


		// .< function foo1(){ x; .~multi; y; .~single; }; >.,
		// .< function foo2(){ .~single; x; .~multi; y;  }; >.,
		// .< function foo3(){ .~single; .~multi; }; >.,
		// .< function foo4(){ .~multi; }; >.,
		// .< function foo5(){ .~single; }; >.,
		// .< if(x==1){ .~single; }; >.,
		// .< while(x==1){ if(2) print(1); .~multi; }; >.,
		// .< while(x==1){ if(2) print(1); .~multi; }; >.,
		// .< while(x==1){ if(2) print(1); .~multi; }; >.,
		// .< try{ .~stmts; } catch(e){ };  >.,
		// .< try{ .~stmts; print(1); } catch(e){ };  >.,
		// .< var tt = .~op * 3; >.
	];
}

// function gen(){

// 	.!gen2().multiFunc;
// 	// .!gen2().singleFunc;
// 	// .!gen2().singleExpr;
// 	// .!gen2().multiExpr;

// 	return .< 1; >.;
// }
.!gen2()[0]; 
// .!gen2()[1];
// .!gen2()[2];
//  .!gen2()[3];
// .!gen2()[4];
// .!gen2()[5];
// .!gen2()[6];
// .!gen2()[7];
// .!gen2()[8];
// .!gen2()[9];
// .!gen2()[10];
// .!gen2()[11];
// .!gen2()[12];
// .!gen2()[13];
// .!gen2()[14];
// .!gen2()[15];
// .!gen2()[16];
// .!gen2()[17];
// .!gen2()[18];
// .!gen2()[19];