import { mat4 } from 'gl-matrix';
// SOURCES: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial
// Author: memer-s

class WebGel {
	gl: WebGLRenderingContext;
	programInfo: object;
	program: any;
	positionBuffer: object;

	constructor(canvas: any, vss: string, fss: string) {
		if (canvas === null) throw ("canvas element not found")

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
		this.positionBuffer = this.initBuffers();

		this.drawScene(this.programInfo, this.positionBuffer);
	}

	initShaderProgram = (vsSource: string, fsSource: string) => {
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

	loadShader = (type: any, source: string) => {
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

	initBuffers = () => {
		const positionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
		const positions = [
			1.0, 1.0,
			-1.0, 1.0,
			1.0, -1.0,
			-1.0, -1.0,
		];

		// Now pass the list of positions into WebGL to build the
		// shape. We do this by creating a Float32Array from the
		// JavaScript array, then use it to fill the current buffer.

		this.gl.bufferData(this.gl.ARRAY_BUFFER,
			new Float32Array(positions),
			this.gl.STATIC_DRAW);

		return {
			position: positionBuffer,
		};
	}

	getProgramInfo = (sp: WebGLProgram) => {
		return {
			program: sp,
    attribLocations: {
      vertexPosition: this.gl.getAttribLocation(sp, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: this.gl.getUniformLocation(sp, 'uProjectionMatrix'),
      modelViewMatrix: this.gl.getUniformLocation(sp, 'uModelViewMatrix'),
    },
		}
	}

	drawScene = (programInfo: any, buffers: any) => {
		console.log(programInfo);
		
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

		mat4.translate(modelViewMatrix,     // destination matrix
			modelViewMatrix,     // matrix to translate
			[-0.0, 0.0, -6.0]);  // amount to translate

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
				offset);
			this.gl.enableVertexAttribArray(
				programInfo.attribLocations.vertexPosition);
		}

		// Tell WebGL to use our program when drawing

		this.gl.useProgram(programInfo.program);

		// Set the shader uniforms

		this.gl.uniformMatrix4fv(
			programInfo.uniformLocations.projectionMatrix,
			false,
			projectionMatrix);
		this.gl.uniformMatrix4fv(
			programInfo.uniformLocations.modelViewMatrix,
			false,
			modelViewMatrix);

		{
			const offset = 0;
			const vertexCount = 4;
			this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
		}
	}
}

export default WebGel;