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
	constructor() {
		super(standardVSource, standardFSource, "default")
	}
}

class textureMaterial extends Material {
	constructor() {
		super(textureVSource, textureFSource, "texture", [], true)
	}
}

class shaderMaterial extends Material {
	constructor(vsSource: string, fsSource: string, name: string = "shader", uniforms: Array<Uniform>, isTexture: boolean = false) {
		super(vsSource, fsSource, name, uniforms, isTexture);
	}
}

export { shaderMaterial, normalMaterial, standardMaterial, Material }