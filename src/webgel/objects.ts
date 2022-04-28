import {Material, normalMaterial, shaderMaterial} from './material';
import { mat4, vec3 } from 'gl-matrix';
import { Vec3, Vec2 } from './measures'

interface Rotation {
	x: number,
	y: number,
	z: number
}

class WObject {
	position: Vec3;
	private modelViewMatrix: mat4;
	//@ts-ignore
	private material: Material;
	private id: number;
	rotation: Rotation;
	private removeFunction: () => void;

	constructor(pos: Vec3) {
		this.position = pos;
		this.modelViewMatrix = mat4.create();
		this.rotation = {x: 0, y: 0, z: 0}
		
		let posVec = vec3.create()
		vec3.set(posVec, pos.x, pos.y, pos.z)
		mat4.translate(this.modelViewMatrix, this.modelViewMatrix, posVec)
		this.id = 69420;
	}

	getVertices = (): Array<number> => {
		console.error("VERTICE DATA NOT PROVIDED.")
		return [];
	}

	setMaterial = (mat: Material) => {
		this.material = mat;
	}

	getMaterial = () => {
		return this.material;
	}

	setId(id:number) {
		this.id = id;
	}

	getId() {
		return this.id
	}
	
	getModelViewMatrix() {
		return this.modelViewMatrix;
	}

	rotate = {
		x: (radians: number): void => {this.rotation.x += radians},
		y: (radians: number): void => {this.rotation.y += radians},
		z: (radians: number): void => {this.rotation.z += radians}
	}

	move = {
		x: (units: number): void => {mat4.translate(this.modelViewMatrix, this.modelViewMatrix, vec3.set(vec3.create(), units, 0, 0))},
		y: (units: number): void => {mat4.translate(this.modelViewMatrix, this.modelViewMatrix, vec3.set(vec3.create(), 0, units, 0))},
		z: (units: number): void => {mat4.translate(this.modelViewMatrix, this.modelViewMatrix, vec3.set(vec3.create(), 0, 0, units))}
	}

	addVertPos = (arr: Array <number>, x: number, y: number, z: number) => {
		arr.push(x); arr.push(y); arr.push(z);
	}

	setRemove(callback: any) {
		this.removeFunction = callback;
	}

	remove() {
		this.removeFunction();
	}
}

class Camera extends WObject {
	constructor(pos: Vec3) {
		super(pos);
	}
}

class Plane extends WObject {
	width: number;
	height: number;
	segments: number;
	uniforms: any;
	standing: boolean;

	constructor(pos: Vec3, size: Vec2, segments: number, standing: boolean = false) {
		super(pos)
		this.width = size.x;
		this.height = size.y;
		this.segments = segments;
		this.standing = standing;
	}

	getVertices = (): Array<number> => {
		let verts: Array<number> = [];
		if(this.standing) {
			for(let i = 0; i < this.segments; i++) {
				for(let j = 0; j < this.segments; j++) {
					this.addVertPos(verts, (this.width/this.segments)*i    , (this.height/this.segments)*j, 0);
					this.addVertPos(verts, (this.width/this.segments)*(i+1), (this.height/this.segments)*j, 0);
					this.addVertPos(verts, (this.width/this.segments)*(i+1), (this.height/this.segments)*(j+1), 0);
	
					this.addVertPos(verts, (this.width/this.segments)*i    , (this.height/this.segments)*j, 0);
					this.addVertPos(verts, (this.width/this.segments)*i    , (this.height/this.segments)*(j+1), 0);
					this.addVertPos(verts, (this.width/this.segments)*(i+1), (this.height/this.segments)*(j+1), 0);
				}
			}
		}
		else {
			for(let i = 0; i < this.segments; i++) {
				for(let j = 0; j < this.segments; j++) {
					this.addVertPos(verts, (this.width/this.segments)*i    , 0, (this.height/this.segments)*j);
					this.addVertPos(verts, (this.width/this.segments)*(i+1), 0, (this.height/this.segments)*j);
					this.addVertPos(verts, (this.width/this.segments)*(i+1), 0, (this.height/this.segments)*(j+1));
	
					this.addVertPos(verts, (this.width/this.segments)*i    , 0, (this.height/this.segments)*j);
					this.addVertPos(verts, (this.width/this.segments)*i    , 0, (this.height/this.segments)*(j+1));
					this.addVertPos(verts, (this.width/this.segments)*(i+1), 0, (this.height/this.segments)*(j+1));
				}
			}
		}
		return verts;
	}
}

class Cube extends WObject {
	constructor(pos: Vec3) {
		super(pos);

	}

	getVertices = (): Array<number> => {
		let verts: Array<number> = [];
		
		this.addVertPos(verts, 0,0,0); // Tri 1 Front
		this.addVertPos(verts, 0,1,0);
		this.addVertPos(verts, 1,1,0);

		this.addVertPos(verts, 0,0,0); // Tri 2
		this.addVertPos(verts, 1,0,0);
		this.addVertPos(verts, 1,1,0);

		this.addVertPos(verts, 0,0,1); // Tri 3 Back
		this.addVertPos(verts, 0,1,1);
		this.addVertPos(verts, 1,1,1);

		this.addVertPos(verts, 0,0,1); // Tri 4
		this.addVertPos(verts, 1,0,1);
		this.addVertPos(verts, 1,1,1);

		this.addVertPos(verts, 0,0,1); // Tri 5 Left
		this.addVertPos(verts, 0,1,0);
		this.addVertPos(verts, 0,1,1);

		this.addVertPos(verts, 0,0,0); // Tri 6
		this.addVertPos(verts, 0,0,1);
		this.addVertPos(verts, 0,1,0);

		this.addVertPos(verts, 1,1,0);
		this.addVertPos(verts, 1,0,1); // Tri 7 Left
		this.addVertPos(verts, 1,1,1);

		this.addVertPos(verts, 1,0,0); // Tri 8
		this.addVertPos(verts, 1,0,1);
		this.addVertPos(verts, 1,1,0);

		this.addVertPos(verts, 1,0,0); // Tri 9 Bottom
		this.addVertPos(verts, 0,0,1);
		this.addVertPos(verts, 1,0,1);

		this.addVertPos(verts, 0,0,0); // Tri 10
		this.addVertPos(verts, 0,0,1);
		this.addVertPos(verts, 1,0,0);

		this.addVertPos(verts, 1,1,1); // Tri 11 Top
		this.addVertPos(verts, 1,1,0);
		this.addVertPos(verts, 1,1,1);

		this.addVertPos(verts, 1,1,0); // Tri 12
		this.addVertPos(verts, 1,1,1);
		this.addVertPos(verts, 0,1,0);
		
		return verts;
	};
}



export {Vec3, Vec2, WObject, Camera}
export {Plane, Cube}