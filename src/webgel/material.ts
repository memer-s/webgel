//@ts-ignore
import normalVSource from './shaders/normal/vertex.glsl'
//@ts-ignore
import normalFSource from './shaders/normal/fragment.glsl'

class normalMaterial {
	name: string = "normal";
	vsSource = normalVSource;
	fsSource = normalFSource;
	
	constructor() {

	}
}

class shaderMaterial {
	name: string = "shader";
	vsSource: string;
	fsSource: string;
	constructor(vsSource: string, fsSource: string) {
		this.vsSource = vsSource;
		this.fsSource = fsSource;
	}
}

export { shaderMaterial, normalMaterial }