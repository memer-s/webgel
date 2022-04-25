class Vec3 {
	x: number
	y: number
	z: number

	constructor(x: number, y:number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
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

class WObject {
	position: Vec3;
	constructor(pos: Vec3) {
		this.position = pos;
	}
}


class Camera extends WObject {
	constructor(pos: Vec3) {
		super(pos);
	}
}

class Cube extends WObject {
	width: number;
	height: number;
	segments: number;
	
	constructor(pos: Vec3, size: Vec2, segments: number) {
		super(pos)
		this.width = size.x;
		this.height = size.y;
		this.segments = segments;
	}

	getVertices = () => {
		let verts: Array<number> = [];
		for(let i = 0; i < this.segments; i++) {
			for(let j = 0; j < this.segments; j++) {
				this.addVertPos(verts, this.position.x + (this.width/this.segments)*i    , this.position.y+(this.height/this.segments)*j);
				this.addVertPos(verts, this.position.x + (this.width/this.segments)*(i+1), this.position.y+(this.height/this.segments)*j);
				this.addVertPos(verts, this.position.x + (this.width/this.segments)*(i+1), this.position.y+(this.height/this.segments)*(j+1));

				this.addVertPos(verts, this.position.x + (this.width/this.segments)*i    , this.position.y+(this.height/this.segments)*j);
				this.addVertPos(verts, this.position.x + (this.width/this.segments)*i    , this.position.y+(this.height/this.segments)*(j+1));
				this.addVertPos(verts, this.position.x + (this.width/this.segments)*(i+1), this.position.y+(this.height/this.segments)*(j+1));
			}
		}
		return verts;
	}

	addVertPos = (arr: Array <number>, x: number,y: number) => {
		arr.push(x); arr.push(y);
	}
}

class Uniform {
	type: string
	value: number
	constructor(type: string, value: number) {
		this.type = type,
		this.value = value
	}
}

export {Vec3, Vec2, WObject, Camera, Cube, Uniform}