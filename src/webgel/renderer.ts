import { Camera, WObject } from "./objects";
import { standardMaterial, Material, textureMaterial } from "./material";
import { mat4 } from 'gl-matrix';

interface Programs {
	[key: string]: any
}

interface WorldObjects {
	[key: number]: {
		object: WObject,
		buffers: {
			vertex: WebGLBuffer,
			indices: WebGLBuffer | undefined,
			textureCoords: WebGLBuffer | undefined | null,
		}
		texture: WebGLTexture | undefined
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
	
	// Add object to world.
	addObject = (obj: WObject) => {
		const id = Math.floor(Math.random() * Date.now());

		let material = this.compileShaderProgram(obj.getMaterial());
		this.programs[obj.getMaterial().name] = material;

		// Initialize Vertex buffer.
		const positionBuffer = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
		const positions = obj.getVertices();

		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW)
		if(positionBuffer !== null) {
			this.objects[id] = {
				object: obj,
				buffers: {
					vertex: positionBuffer,
					indices: undefined,
					textureCoords: undefined
				},
				texture: undefined
			}
		}
		
		obj.setId(id);

		// Initialize index buffer if it exists on object.
		let indices = obj.getIndices()
		if(indices) {
			const indexBuffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
			this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
			console.log(new Uint16Array(indices));
			
			if(indexBuffer)
				this.objects[id].buffers.indices = indexBuffer
			else 
				console.error("Could not initialize index buffer.");		
		}
		
		// Initialize texture	
		let objMat = obj.getMaterial() as textureMaterial;
		if(objMat.isTexture) {
			this.getTexture(obj);
			const textureCoordBuffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, textureCoordBuffer)
			const textureCoordinates = obj.getTextureCoords();
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), this.gl.STATIC_DRAW);
			if(textureCoordBuffer)
				this.objects[id].buffers.textureCoords = textureCoordBuffer;
			else
				console.error("Could not initialize textureCoordBuffer.");
				
		}


		obj.setRemove(() => {
			delete this.objects[id];
		})

		console.log(`Object added with id ${id}`, this.objects);
	};

	getTexture = (obj: WObject) => {
		const texture = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
		const pixel = new Uint8Array([0,0,255,255])
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixel);

		let objMat = obj.getMaterial() as textureMaterial;

		objMat.loadTexture((image) => {
			this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
			if(isPowerOf2(image.width) && isPowerOf2(image.height)) {
				this.gl.generateMipmap(this.gl.TEXTURE_2D);
			}
			else {
				this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
				this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
				this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
			}
		})

		console.log(this.objects[obj.getId()]);
		if(texture !== null)
			this.objects[obj.getId()].texture = texture;
		else 
			console.error("Could not initialize texture.");

		function isPowerOf2(value: number) {
			return (value & (value - 1)) == 0;
		}
	}

	useCamera = (camera: Camera) => {
		this._camera = camera;
	}

	useLoop = (func: any) => {
		this._loop = func;
	}

	// Executed each frame.
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
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.objects[obj.getId()].buffers.vertex);
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

		if(this.objects[obj.getId()].texture != undefined) {
			// console.log(this.objects[obj.getId()].buffers.textureCoords);
			
			//@ts-ignore
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.objects[obj.getId()].buffers.textureCoords);

			this.gl.vertexAttribPointer(
				this.gl.getAttribLocation(program, 'vTexture'),
				2,
				this.gl.FLOAT,
				false, 0, 0
			);

			this.gl.enableVertexAttribArray(this.gl.getAttribLocation(program, 'vTexture'))

			this.gl.activeTexture(this.gl.TEXTURE0);
			let tex = this.objects[obj.getId()].texture
			if(tex)
				this.gl.bindTexture(this.gl.TEXTURE_2D, tex)
			else
				console.error("Texture not initialized.");
			
		}

		if(this.objects[obj.getId()].buffers.indices) {
			this.gl.drawElements(this.renderMethod, this.objects[obj.getId()].object.getIndices().length, this.gl.UNSIGNED_SHORT, 0);
			// console.log(this.objects[obj.getId()].object.getVertices().length); this.objects[obj.getId()].object.getVertices().length*2
		}
		else {
			this.gl.drawArrays(this.renderMethod, 0, this.objects[obj.getId()].object.getVertices().length/3)
		}
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
				switch(el.type) {
					case "float":
						this.gl.uniform1f(
							this.gl.getUniformLocation(program, el.uniformName), el.value
						)
						break;

					case "vec3":
						this.gl.uniform3f(
							this.gl.getUniformLocation(program, el.uniformName), el.value.x, el.value.y, el.value.z
						)
						break;

					case "int":
						this.gl.uniform1i(
							this.gl.getUniformLocation(program, el.uniformName), parseInt(el.value)
						)
						break;
				}
			})

			this.drawObject(this.objects[obj].object)
		}

	}

}


export { Renderer }