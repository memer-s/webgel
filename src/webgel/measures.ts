class Vec3 {
	x: number
	y: number
	z: number

	constructor(x: number, y:number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	toArray() {
		return [this.x,this.y,this.z];
	}
}

class Vec2 {
	x: number;
	y: number;

	constructor(x:number, y:number) {
		this.x = x;
		this.y = y;
	}
}

export {Vec2, Vec3}