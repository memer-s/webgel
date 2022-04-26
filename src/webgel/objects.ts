import {normalMaterial, shaderMaterial} from './material';
import { mat4, vec3 } from 'gl-matrix';
import {Vec3, Vec2} from './measures'

class WObject {
	position: Vec3;
	private modelViewMatrix: mat4;
	//@ts-ignore
	private material: normalMaterial | shaderMaterial;
	private id: number;

	constructor(pos: Vec3) {
		this.position = pos;
		this.modelViewMatrix = mat4.create();
		
		let posVec = vec3.create()
		vec3.set(posVec, pos.x, pos.y, pos.z)
		mat4.translate(this.modelViewMatrix, this.modelViewMatrix, posVec)
		this.id = 69420;
	}

	getVertices = (): Array<number> => {
		console.error("VERTICE DATA NOT PROVIDED.")
		return [];
	}

	setMaterial = (mat: normalMaterial | shaderMaterial) => {
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
		x: (radians: number): void => {mat4.rotateX(this.modelViewMatrix, this.modelViewMatrix, radians)},
		y: (radians: number): void => {mat4.rotateY(this.modelViewMatrix, this.modelViewMatrix, radians)},
		z: (radians: number): void => {mat4.rotateZ(this.modelViewMatrix, this.modelViewMatrix, radians)}
	}

	move = {
		x: (units: number): void => {mat4.translate(this.modelViewMatrix, this.modelViewMatrix, vec3.set(vec3.create(), units, 0, 0))},
		y: (units: number): void => {mat4.translate(this.modelViewMatrix, this.modelViewMatrix, vec3.set(vec3.create(), 0, units, 0))},
		z: (units: number): void => {mat4.translate(this.modelViewMatrix, this.modelViewMatrix, vec3.set(vec3.create(), 0, 0, units))}
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
	uniforms: any;

	constructor(pos: Vec3, size: Vec2, segments: number) {
		super(pos)
		this.width = size.x;
		this.height = size.y;
		this.segments = segments;
	}

	getVertices = (): Array<number> => {
		let verts: Array<number> = [];
		for(let i = 0; i < this.segments; i++) {
			for(let j = 0; j < this.segments; j++) {
				this.addVertPos(verts, (this.width/this.segments)*i    , (this.height/this.segments)*j);
				this.addVertPos(verts, (this.width/this.segments)*(i+1), (this.height/this.segments)*j);
				this.addVertPos(verts, (this.width/this.segments)*(i+1), (this.height/this.segments)*(j+1));

				this.addVertPos(verts, (this.width/this.segments)*i    , (this.height/this.segments)*j);
				this.addVertPos(verts, (this.width/this.segments)*i    , (this.height/this.segments)*(j+1));
				this.addVertPos(verts, (this.width/this.segments)*(i+1), (this.height/this.segments)*(j+1));
			}
		}
		return verts;
	}

	addVertPos = (arr: Array <number>, x: number,y: number) => {
		arr.push(x); arr.push(y);
	}
}



export {Vec3, Vec2, WObject, Camera, Cube}