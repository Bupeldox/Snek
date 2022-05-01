
export default class Vec2 {
	constructor(x, y) {
		
		if (x.hasOwnProperty("x")) {
			if (y && y.hasOwnProperty("x")) {
				var out = y.sub(x);
				this.x = out.x;
				this.y = out.y;
			}else{
				this.x = x.x;
				this.y = x.y;
			}
		} else {
			this.x = x;
			this.y = y;
		}
	}

	distance(vec) {
		var delta = this.sub(vec);
		return delta.magnitude();
	}

	add(vec) {
		return new Vec2(this.x + vec.x, this.y + vec.y);
	}
	sub(vec) {
		return new Vec2(this.x - vec.x, this.y - vec.y);
	}
	times(factor) {
		return new Vec2(this.x * factor, this.y * factor);
	}
	magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	normalised() {
		var out = this.times(1 / this.magnitude());
		return new Vec2(out.x, out.y);
	}
	dot(vec) {
		return this.x * vec.x + this.y * vec.y;
	}
	angle(vec) {
		var x1 = this.x;
		var y1 = this.y;
		var x2 = vec.x;
		var y2 = vec.y;

		var dot = x1 * x2 + y1 * y2; //# dot product between [x1, y1] and [x2, y2]
		var det = x1 * y2 - y1 * x2; //# determinant
		var angle = Math.atan2(det, dot); //# atan2(y, x) or atan2(sin, cos)
		return angle;
	}
	rotate(angle) {
		var magnitude = this.magnitude();
		var myangle = this.angle(new Vec2(0, 1));
		var newAngle = myangle + angle;

		var x = Math.sin(newAngle);
		var y = Math.cos(newAngle);

		var newVec = new Vec2(x, y);
		newVec = newVec.times(magnitude);
		return newVec;
	}

	clone() {
		return new Vec2(this.x, this.y);
	}
}

