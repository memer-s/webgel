//@ts-ignore
import normalVSource from './../shaders/normal/vertex.glsl'
//@ts-ignore
import normalFSource from './../shaders/normal/fragment.glsl'

class Material {
	vsSource: string;
	fsSource: string;

	constructor(vs: string, fs: string) {
		this.vsSource = vs;
		this.fsSource = fs;
	}

	public getVsSource = () => {
		return this.vsSource;
	}

	public getFsSource = () => {
		return this.fsSource;
	}
}

class normalMaterial extends Material {
	name: string = "normal";
	constructor() {
		super(normalVSource, normalFSource)
	}
}

class shaderMaterial extends Material {
	name: string = "shader";
	constructor(vsSource: string, fsSource: string) {
		super(vsSource, fsSource);
	}
}

export { shaderMaterial, normalMaterial, Material }