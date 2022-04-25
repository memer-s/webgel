import { mat4 } from 'gl-matrix';
// SOURCES: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial
// Author: memer-s

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
		let verts: Array = [];
		for(let i = 0; i < this.segments; i++) {
			for(let j = 0; j < this.segments; j++) {
				this.addVertPos(verts, this.position.x + (this.width/this.segments)*i    , this.position.y+(this.width/this.segments)*j);
				this.addVertPos(verts, this.position.x + (this.width/this.segments)*(i+1), this.position.y+(this.width/this.segments)*j);
				this.addVertPos(verts, this.position.x + (this.width/this.segments)*(i+1), this.position.y+(this.width/this.segments)*(j+1));

				this.addVertPos(verts, this.position.x + (this.width/this.segments)*i    , this.position.y+(this.width/this.segments)*j);
				this.addVertPos(verts, this.position.x + (this.width/this.segments)*i    , this.position.y+(this.width/this.segments)*(j+1));
				this.addVertPos(verts, this.position.x + (this.width/this.segments)*(i+1), this.position.y+(this.width/this.segments)*(j+1));
			}
		}
		return verts;
	}

	addVertPos = (arr: Array, x: number,y: number) => {
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

class WebGel {
	programInfo: object;
	private gl: WebGLRenderingContext;
	private program: any;
	private Buffers: object;
	private _camera: Camera | null = null;
	private then: number = 0;
	private dt: number = 0;
	private animationFunction: (dt: number) => void = () => {};
	private time: number = 0.0;
	private uniforms: object;

	private vss: string;
	private fss: string;

	constructor(canvas: any, vss: string, fss: string) {
		if (canvas === null) throw ("canvas element not found")

		this.vss = vss;
		this.fss = fss;

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
		
		this.program = this.initShaderProgram(vss, fss);
		this.programInfo = this.getProgramInfo(this.program); 
		this.Buffers = this.initBuffers();

	}

	private reload = () => {
		this.program = this.initShaderProgram(this.vss, this.fss);
		this.programInfo = this.getProgramInfo(this.program); 
		this.Buffers = this.initBuffers();
	}

	private initShaderProgram = (vsSource: string, fsSource: string) => {
		const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource);
		const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource);

		const shaderProgram = this.gl.createProgram();
		if (shaderProgram === null) throw ("Could not create shader program.");
		this.gl.attachShader(shaderProgram, vertexShader);
		this.gl.attachShader(shaderProgram, fragmentShader);
		this.gl.linkProgram(shaderProgram);

		if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
			throw ("Could not initialize shaderProgram" + this.gl.getProgramInfoLog(shaderProgram));
		}

		return shaderProgram;
	}

	private loadShader = (type: any, source: string) => {
		const shader: WebGLShader | null = this.gl.createShader(type);

		if (shader == null) throw (`Shader of type: ${type} invalid.`);

		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
			let errlog = "Shader could not be compiled " + this.gl.getShaderInfoLog(shader);
			this.gl.deleteShader(shader);
			throw (errlog);
		}

		return shader;
	}

	private initBuffers = () => {
		const positionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

		// Now pass the list of positions into WebGL to build the
		// shape. We do this by creating a Float32Array from the
		// JavaScript array, then use it to fill the current buffer.

		
		const cube = new Cube(new Vec3(0,0,0), new Vec2(2,2), 10)

		const positions = cube.getVertices()
		console.log(positions);
		
		// const positions = [
		// -1.0, -1.0,
		// 	1.0, -1.0,
		// 	-1.0, 1.0,

		// 	-1.0, 1.0,
		// 	1.0, -1.0,
		// 	1.0, 1.0,
		// ];

		this.gl.bufferData(this.gl.ARRAY_BUFFER,
			new Float32Array(positions),
			this.gl.STATIC_DRAW);

		let colors = [];
		for(let i = 0; i < 600; i++) {
			for(let _ = 0; _ < 3; _++)
			{
				colors.push(1.0);
			}
			colors.push(1.0);
		}

		const colorBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW)



		return {
			position: positionBuffer,
			color: colorBuffer
		};
	}

	useCamera(camera: Camera) {
		this._camera = camera;
		requestAnimationFrame(this.render);
	}

	private getProgramInfo = (sp: WebGLProgram) => {
		let pInfo = {
			program: sp,
			attribLocations: {
				vertexPosition: this.gl.getAttribLocation(sp, 'aVertexPosition'),
				vertexColor: this.gl.getAttribLocation(sp, "aVertexColor")
			},
			uniformLocations: {
				projectionMatrix: this.gl.getUniformLocation(sp, 'uProjectionMatrix'),
				modelViewMatrix: this.gl.getUniformLocation(sp, 'uModelViewMatrix'),
			},
		}
		
		for(let uniform in this.uniforms) {
			let obj = (this.uniforms as any)[uniform];
			if(obj.type === "float") {
				(pInfo.uniformLocations as any)[uniform] = this.gl.getUniformLocation(sp, uniform)
			}
		}
		console.log(pInfo);
		
		return pInfo;
	}

	addUniform = (key: string, uniform: Uniform) => {
		(this.uniforms as any)[key] = uniform;
		console.log(this.uniforms);
		this.reload()
	}

	updateUniform = (key: string, value: number) => {
		(this.uniforms as any)[key].value = value;
	}

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
			const vertexCount = 2000;
			this.gl.drawArrays(this.gl.TRIANGLES, offset, vertexCount);
		}
	}

	render = (now: DOMHighResTimeStamp) => {
		now *= 0.001;
		this.dt = now - this.then;
		this.uniforms.time.value += this.dt;
		// console.log(this.uniforms.time.value);
		// console.log(this.time);
		
		this.animationFunction(this.dt);
		this.then = now;
		this.drawScene(this.programInfo, this.Buffers);
		requestAnimationFrame(this.render);
	}

	loop = (func: (dt: number) => void) => {
		this.animationFunction = func;
	}

	fetchCurrentFPS = () => {
		return 1/this.dt;
	}
}

export {Vec2, Vec3, Camera, Uniform, Cube}
export default WebGel;