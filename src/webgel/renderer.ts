import { Uniform, Camera } from "./types";
import { normalMaterial, shaderMaterial } from "./material";
import { mat4 } from 'gl-matrix';

class Renderer {
	gl: WebGLRenderingContext;
	currentMaterial: string = "";
	_camera: Camera;

	constructor(gl: WebGLRenderingContext) {
		this.gl = gl;
	}

	useCamera = (camera: Camera) => {
		this._camera = camera;
		requestAnimationFrame(this.render);
	}

	useMaterial = (material: normalMaterial | shaderMaterial) => {
		this.currentMaterial = material.name;
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

	getProgramInfo = (sp: WebGLProgram, uniforms: any) => {
		let pInfo = {
			program: sp,
			attribLocations: {
				vertexPosition: this.gl.getAttribLocation(sp, 'vPosition'),
				vertexColor: this.gl.getAttribLocation(sp, "vertexColor")
			},
			uniformLocations: {
				projectionMatrix: this.gl.getUniformLocation(sp, 'uProjectionMatrix'),
				modelViewMatrix: this.gl.getUniformLocation(sp, 'uModelViewMatrix'),
			},
		}
		
		for(let uniform in uniforms) {
			let obj = (uniforms as any)[uniform];
			if(obj.type === "float") {
				(pInfo.uniformLocations as any)[uniform] = this.gl.getUniformLocation(sp, uniform)
			}
		}
		console.log(pInfo);
		
		return pInfo;
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
			const vertexCount = this.vertexCount;
			this.gl.drawArrays(this.gl.TRIANGLES, offset, vertexCount);
		}
	}

}


export { Renderer }