import { Uniform, Camera, WObject } from "./types";
import { normalMaterial, shaderMaterial, Material } from "./material";
import { mat4 } from 'gl-matrix';

interface Programs {
	[key: string]: any
}

class Renderer {
	gl: WebGLRenderingContext;
	currentMaterial: string = "";

	_camera: Camera | null = null;
	_loop: (dt: number) => void;
	dt: number = 0;
	then: number = 0;

	programs: Programs;
	objects: Array<WObject>;

	constructor(gl: WebGLRenderingContext) {
		this.gl = gl;
		this._loop = (dt) => {
		};
		this.programs = {};
		this.objects = [];
	}
	
	addObject = (obj: WObject) => {
		let material = this.compileShaderProgram(obj.getMaterial());
		this.programs[obj.getMaterial().name] = material;
		console.log(this.programs);
	};

	useCamera = (camera: Camera) => {
		this._camera = camera;
	}

	useMaterial = (material: normalMaterial | shaderMaterial) => {
		this.currentMaterial = material.name;
	}

	useLoop = (func: any) => {
		this._loop = func;
	}

	render = (now: DOMHighResTimeStamp) => {
		now *= 0.001;
		this.dt = now - this.then;
		//@ts-ignore
		this.uniforms.time.value += this.dt;
		// console.log(this.uniforms.time.value);
		// console.log(this.time);
		
		this._loop(this.dt);
		this.then = now;
		this.drawScene(this.programInfo, this.Buffers);
		requestAnimationFrame(this.render);
	}

	addUniform = (key: string, uniform: Uniform) => {
		(this.uniforms as any)[key] = uniform;
		console.log(this.uniforms);
		this.reload()
	}

	updateUniform = (key: string, value: number) => {
		(this.uniforms as any)[key].value = value;
	}

	private reload = () => {
		// this.program = this.renderer.initShaderProgram(this.vss, this.fss);
		// this.programInfo = this.renderer.getProgramInfo(this.program, this.uniforms); 
		// this.Buffers = this.initBuffers();
	}

	compileShaderProgram = (material: Material) => {
		console.log(material.name);
		let shaderProgram = this.initShaderProgram(material.getVsSource(), material.getFsSource());
		
		return shaderProgram;
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
	
		mat4.perspective(projectionMatrix,
			fieldOfView,
			aspect,
			zNear,
			zFar);
	
		const modelViewMatrix = mat4.create();
	
		if(this._camera)
		mat4.translate(modelViewMatrix,
			modelViewMatrix,
			[this._camera.position.x, this._camera.position.y, this._camera.position.z]
		);
		else { console.error("No camera initialized."); mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -5]); }
		for(let i = 0; i < this.objects.length; i++) {

		}
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