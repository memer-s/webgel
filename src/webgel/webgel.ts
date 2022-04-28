import { Renderer } from './renderer';

// SOURCES: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial
// Author: memer-s

class WebGel {
	private gl: WebGLRenderingContext;
	//@ts-ignore
	private renderer: Renderer;

	constructor(canvas: any) {
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
	}
	
	get glInstance() {
		return this.gl;
	}

	useRenderer = (renderer: Renderer) => {
		this.renderer = renderer;

		// this.Buffers = this.initBuffers();
	}

	loop = (func: (dt: number) => void) => {
		this.renderer.useLoop(func)
	}

	fetchCurrentFPS = () => {
		return 1/this.renderer.dt;
	}
}

export default WebGel;