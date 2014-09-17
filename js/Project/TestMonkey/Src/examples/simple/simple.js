function genSimpleTests(){
	var multi = .< print('meta'); x = y ? 1 : 2; >.;
	var single = .< print('meta'); >.;
	var multiExpr = .< 1 - 2 + 3; >.;
	var singleExpr = .< x + y; >.;
	var id = .< x; >.;

	var duckString = 'test duck';
	var duckNum = 1;
	var duckBool = true;
	return [
		.< '.< 1 + .~multiExpr; + .@duckString >.'; >.,
		.< 1 + .~multiExpr + .@duckString; >.,
		.< '.< 2 + .~singleExpr; >.'; >.,
		.< 2 + .~singleExpr; >.,
		.< '.< print(.~multi, 2); >.'; >.,
		.< print(.~multi, 2); >.,
		.< '.< print(1, .~single); >.'; >.,
		.< print(1, .~single); >.,
		.< '.< function foo1(){ print(.@duckNum); .~multi; print(2); }; >.'; >.,
		.< function foo1(){ print(.@duckNum); .~multi; print(2); }; >.,
		.< '.< function foo2(){ print(1); .~single; print(2); }; >.'; >.,
		.< function foo2(){ print(1); .~single; print(2); }; >.,
		.< '.< .~multiExpr * .~id * 2 / .~singleExpr - .~multiExpr;  >.'; >.,
		.< .~multiExpr * .~id * 2 / .~singleExpr - .~multiExpr;  >.,
		.< '.< (.~id)[.~single][.@duckBool]; >.'; >.,
		.< (.~id)[.~single][.@duckBool]; >.
	];
}

console.log( 'unit test begin:' );

.!.<
	"var multi = .< print('meta'); x = y ? 1 : 2; >.; \
	var single = .< print('meta'); >.; \
	var multiExpr = .< 1 - 2 + 3; >.; \
	var singleExpr = .< x + y; >.; \
	var id = .< x; >.;\
	var duckString = 'test duck';\
	var duckNum = 1;\
	var duckBool = true;";
 >.

.!genSimpleTests()[0]; .!genSimpleTests()[1]; .!(.< "__________________"; >.);
.!genSimpleTests()[2]; .!genSimpleTests()[3]; .!(.< "__________________"; >.);
.!genSimpleTests()[4]; .!genSimpleTests()[5]; .!(.< "__________________"; >.);
.!genSimpleTests()[6]; .!genSimpleTests()[7]; .!(.< "__________________"; >.);
.!genSimpleTests()[8]; .!genSimpleTests()[9]; .!(.< "__________________"; >.);
.!genSimpleTests()[10]; .!genSimpleTests()[11]; .!(.< "__________________"; >.);
.!genSimpleTests()[12]; .!genSimpleTests()[13]; .!(.< "__________________"; >.);
.!genSimpleTests()[14]; .!genSimpleTests()[15]; .!(.< "__________________"; >.);

function power(x, n){
	if(n===1)
		return x;
	else 
		return .< .~x * .~power(x, n-1); >.;
}

.!power( .< y - 1; >., 5 );