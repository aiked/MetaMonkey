.& {
	function Ctor(name, args, stmts) {
		return .< 
			function .~(name)(.~args){
				.~stmts;
			};
		>.;
	}

	var a = .< x, y; >.;
	var s = .< this.x = x; this.y = y; >.;

	var point2dCtor = Ctor (.< Point2d; >., a, s);
	point3dCtor = Ctor (
	.< Point3d; >.,
	.< .~a, z; >.,
	.< .~s; this.z = z; >.
	);
}

.!point2dCtor;
var point1 = new Point2d(2,10);
.!point3dCtor;
var point2 = new Point3d(2,10, 50);