class OBJLoader {
	constructor() {

	}

	load(file: string, callback: (data: object) => void) {
		let lines = file.split("\n");
		callback({lines});
	}
}

export default OBJLoader;