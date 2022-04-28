import { Camera, WObject } from "./objects";
import { standardMaterial, Material } from "./material";
import { mat4, vec3 } from 'gl-matrix';

interface Programs {
	[key: string]: any
}

interface WorldObjects {
	[key: number]: {
		object: WObject,
		vertexBuffer: WebGLBuffer,
	}
}

class Renderer {
	gl: WebGLRenderingContext;

	_camera: Camera | null = null;
	_loop: (dt: number) => void;
	dt: number = 0;
	then: number = 0;
	_renderProgram: any;

	programs: Programs;
	objects: WorldObjects;
	renderMethod: any;

	constructor(gl: WebGLRenderingContext) {
		this.gl = gl;
		this.renderMethod = gl.TRIANGLES;
		this._loop = () => {
		};
		this.programs = {};
		this.objects = {};
		this._renderProgram = this.compileShaderProgram(new standardMaterial())
	}
	
	addObject = (obj: WObject) => {
		const id = Math.floor(Math.random() * Date.now());

		let material = this.compileShaderProgram(obj.getMaterial());
		this.programs[obj.getMaterial().name] = material;

		const positionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)

		const positions = obj.getVertices();

		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW)
		if(positionBuffer !== null) {
			this.objects[id] = {
				object: obj,
				vertexBuffer: positionBuffer
			}
		}

		obj.setId(id);

		obj.setRemove(() => {
			delete this.objects[id];
		})

		console.log(`Object added with id ${id}`);
	};

	useCamera = (camera: Camera) => {
		this._camera = camera;
	}

	useLoop = (func: any) => {
		this._loop = func;
	}

	render = (now: DOMHighResTimeStamp) => {
		now *= 0.001;
		this.dt = now - this.then;
		
		this.drawScene();
		this._loop(this.dt);
		this.then = now;
		requestAnimationFrame(this.render);
	}

	compileShaderProgram = (material: Material) => {
		console.log(material.name);
		let shaderProgram = this.initShaderProgram(material.getVsSource(), material.getFsSource());
		
		return shaderProgram;
	}

	drawObject = (obj: WObject) => {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.objects[obj.getId()].vertexBuffer);
		const program = this.programs[obj.getMaterial().name];
		this.gl.vertexAttribPointer(
			this.gl.getAttribLocation(program, 'vPosition'),
			3,
			this.gl.FLOAT,
			false,
			0,
			0
		);
		this.gl.enableVertexAttribArray(program)
		this.gl.drawArrays(this.renderMethod, 0, this.objects[obj.getId()].object.getVertices().length/3)
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

	private drawScene = () => {
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
			zFar
		);
			
		let modelViewMatrix = mat4.create();

		mat4.rotateX(projectionMatrix, projectionMatrix, 0.436332)
		
		
		
		
		for(const obj in this.objects) {
			// console.log(this.objects[obj]);
			const program = this.programs[this.objects[obj].object.getMaterial().name]
			const object = this.objects[obj].object;
			this.gl.useProgram(program);
			
			this.gl.uniformMatrix4fv(
				this.gl.getUniformLocation(program, 'uProjectionMatrix'),
				false,
				projectionMatrix
				);
				
				// console.log(mat4.getTranslation(vec3.create(), modelViewMatrix)) --> [0,0,-6]
				
			let calculatedMVM = mat4.clone(this.objects[obj].object.getModelViewMatrix())
			
			if(this._camera)
			mat4.translate(
				calculatedMVM,
				calculatedMVM,
				[this._camera.position.x, this._camera.position.y, this._camera.position.z]
			);
			else { console.error("No camera initialized."); mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -5]); }
			
			mat4.rotate(calculatedMVM, calculatedMVM, object.rotation.x, [1,0,0])
			mat4.rotate(calculatedMVM, calculatedMVM, object.rotation.y, [0,1,0])
			mat4.rotate(calculatedMVM, calculatedMVM, object.rotation.z, [0,0,1])

			// mat4.translate(calculatedMVM, this.objects[obj].object.getModelViewMatrix(), mat4.getTranslation(vec3.create(), modelViewMatrix))
			
			this.gl.uniformMatrix4fv(
				this.gl.getUniformLocation(program, 'uModelViewMatrix'),
				false,
				calculatedMVM
				// modelViewMatrix
				// this.objects[obj].object.getModelViewMatrix()

			);

			this.objects[obj].object.getMaterial().getUniforms().forEach((el) => {
				if(el.type === "float") {
					//@ts-ignore
					this.gl.uniform1f(
						this.gl.getUniformLocation(program, el.uniformName), el.value
					)
				}
			})

			this.drawObject(this.objects[obj].object)
		}

	}

}


export { Renderer }