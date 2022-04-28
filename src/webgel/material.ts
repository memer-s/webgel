//@ts-ignore
import normalVSource from './../shaders/normal/vertex.glsl'
//@ts-ignore
import normalFSource from './../shaders/normal/fragment.glsl'
//@ts-ignore
import standardVSource from './../shaders/standard/vertex.glsl'
//@ts-ignore
import standardFSource from './../shaders/standard/fragment.glsl'

//@ts-ignore
import textureVSource from './../shaders/texture/vertex.glsl'
//@ts-ignore
import textureFSource from './../shaders/texture/fragment.glsl'
import { Vec3 } from './measures'

interface Uniform {
	uniformName: string,
	type: string,
	value: any
}

class Material {
	private vsSource: string;
	private fsSource: string;
	private uniforms: Array<Uniform> = [];
	name: string;
	isTexture: boolean;
	
	constructor(vs: string, fs: string, name: string, uniforms: Array<Uniform> = [], isTexture = false) {
		this.vsSource = vs;
		this.fsSource = fs;
		this.name = name;
		this.uniforms = uniforms;
		this.isTexture = isTexture
	}

	public getVsSource = () => {
		return this.vsSource;
	}

	public getFsSource = () => {
		return this.fsSource;
	}

	public getUniforms = () => {
		return this.uniforms;
	}

	public updateUniform = (uniformName: string, value: any) => {
		this.uniforms.forEach((el) => {
			if(el.uniformName === uniformName) {
				el.value = value;
				
			}
		})
		// console.log(this.uniforms);
	}
}

class normalMaterial extends Material {
	constructor() {
		super(normalVSource, normalFSource, "normal", [{uniformName: "time", type: "float", value: 0}])
	}
}

class standardMaterial extends Material {
	constructor(color = new Vec3(0.3,0.5,0.8)) {
		super(standardVSource, standardFSource, "default", [{uniformName: "color", type: "vec3", value: color}])
	}
}

class textureMaterial extends Material {
	src: string;
	texture: WebGLTexture = undefined;
	constructor(src: string) {
		super(textureVSource, textureFSource, "texture", [], true)
		this.src = src;
	}

	loadTexture(callback: (image: HTMLImageElement) => void) {
		const image = new Image();
		image.onload = () => {
			this.texture = image;
			callback(image)
		};
		image.src = this.src;
	}

	getTexture () {
		return this.texture;
	}
}

class shaderMaterial extends Material {
	constructor(vsSource: string, fsSource: string, name: string = "shader", uniforms: Array<Uniform>, isTexture: boolean = false) {
		super(vsSource, fsSource, name, uniforms, isTexture);
	}
}

export { shaderMaterial, normalMaterial, standardMaterial, textureMaterial, Material }