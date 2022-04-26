import { mat4 } from 'gl-matrix';
import { Renderer } from './renderer';
import { Vec3, Vec2, WObject, Camera, Cube, Uniform } from './types';
import {normalMaterial} from './material';

// SOURCES: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial
// Author: memer-s

class WebGel {
	private gl: WebGLRenderingContext;
	private Buffers: object;
	private then: number = 0;
	private dt: number = 0;
	private time: number = 0.0;
	private uniforms: object;
	private vertexCount: number = 1024;
	private worldObjects: Array<WObject> = [];

	private renderer: Renderer;

	constructor(canvas: any) {
		if (canvas === null) throw ("canvas element not found")

		this.uniforms = {'time': new Uniform("float", this.time)};

		let ctx: any = canvas.getContext("webgl");
		if (ctx == null) {
			throw ("Canvas context not found.");
		}
		else {
			this.gl = ctx;
			console.log("Webgel Successfully instantiated.");
		}

		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}
	
	get glInstance() {
		return this.gl;
	}

	useRenderer = (renderer: Renderer) => {
		this.renderer = renderer;

		// this.Buffers = this.initBuffers();
	}


	// private initBuffers = () => {
	// 	const positionBuffer = this.gl.createBuffer();
	// 	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

	// 	// Now pass the list of positions into WebGL to build the
	// 	// shape. We do this by creating a Float32Array from the
	// 	// JavaScript array, then use it to fill the current buffer.

		
	// 	// const cube = new Cube(new Vec3(-2,-1,0), new Vec2(4,2), 10)

	// 	for(let i = 0; i < this.worldObjects.length; i++) {

	// 	}

	// 	// const positions = cube.getVertices()
	// 	// console.log(positions);
		
	// 	// const positions = [
	// 	// -1.0, -1.0,
	// 	// 	1.0, -1.0,
	// 	// 	-1.0, 1.0,

	// 	// 	-1.0, 1.0,
	// 	// 	1.0, -1.0,
	// 	// 	1.0, 1.0,
	// 	// ];

	// 	this.gl.bufferData(this.gl.ARRAY_BUFFER,
	// 		new Float32Array(positions),
	// 		this.gl.STATIC_DRAW);

	// 	let colors = [];
	// 	for(let i = 0; i < 600; i++) {
	// 		for(let _ = 0; _ < 3; _++)
	// 		{
	// 			colors.push(1.0);
	// 		}
	// 		colors.push(1.0);
	// 	}

	// 	const colorBuffer = this.gl.createBuffer();
	// 	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
	// 	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW)


	// 	return {
	// 		position: positionBuffer,
	// 		color: colorBuffer
	// 	};
	// }

	private drawScene = (programInfo: any, buffers: any) => {
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.clearDepth(1.0);
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.depthFunc(this.gl.LEQUAL);

		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

		const fieldOfView = 45 * Math.PI / 180;   // in radians
		const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
		const zNear = 0.1;
		const zFar = 100.0;
		const projectionMatrix = mat4.create();

		// note: glmatrix.js always has the first argument
		// as the destination to receive the result.
		mat4.perspective(projectionMatrix,
			fieldOfView,
			aspect,
			zNear,
			zFar);

		// Set the drawing position to the "identity" point, which is
		// the center of the scene.
		const modelViewMatrix = mat4.create();

		// Now move the drawing position a bit to where we want to
		// start drawing the square.
		if(this._camera)
		mat4.translate(modelViewMatrix,     // destination matrix
			modelViewMatrix,     // matrix to translate
			[this._camera.position.x, this._camera.position.y, this._camera.position.z]
		);  // amount to translate
		else {
			console.error("No camera inited.");
			
			mat4.translate(modelViewMatrix,     // destination matrix
				modelViewMatrix,     // matrix to translate
				[0, 0, -5]
			);  // amount to translate
		}

		// Tell WebGL how to pull out the positions from the position
		// buffer into the vertexPosition attribute.
		{
			const numComponents = 2;  // pull out 2 values per iteration
			const type = this.gl.FLOAT;    // the data in the buffer is 32bit floats
			const normalize = false;  // don't normalize
			const stride = 0;         // how many bytes to get from one set of values to the next
			// 0 = use type and numComponents above
			const offset = 0;         // how many bytes inside the buffer to start from
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
			this.gl.vertexAttribPointer(
				programInfo.attribLocations.vertexPosition,
				numComponents,
				type,
				normalize,
				stride,
				offset
			);

			this.gl.enableVertexAttribArray(
				programInfo.attribLocations.vertexPosition
			);
		}

		{
			const numComponents = 4;
			const type = this.gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
			this.gl.vertexAttribPointer(
				programInfo.attribLocations.vertexColor,
				numComponents,
				type,
				normalize,
				stride,
				offset);
			this.gl.enableVertexAttribArray(
				programInfo.attribLocations.vertexColor
			);
		}

		// Tell WebGL to use our program when drawing

		this.gl.useProgram(programInfo.program);

		// Set the shader uniforms

		this.gl.uniformMatrix4fv(
			programInfo.uniformLocations.projectionMatrix,
			false,
			projectionMatrix
		);

		this.gl.uniformMatrix4fv(
			programInfo.uniformLocations.modelViewMatrix,
			false,
			modelViewMatrix
		);

		
		{		
			for(let uniform in this.uniforms) {
				let obj = (this.uniforms as any)[uniform];
				if(obj.type === "float") {
					this.gl.uniform1f(
						programInfo.uniformLocations[uniform],
						obj.value,
					)
				}
			}
		}
		

		{
			const offset = 0;
			const vertexCount = this.vertexCount;
			this.gl.drawArrays(this.gl.TRIANGLES, offset, vertexCount);
		}
	}

	loop = (func: (dt: number) => void) => {
		this.renderer.useLoop(func)
	}

	fetchCurrentFPS = () => {
		return 1/this.dt;
	}
}

export {Vec2, Vec3, Camera, Uniform, Cube}
export default WebGel;