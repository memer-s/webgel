interface ReturnObject {
	vertices: Array<number>,
	indices: Array<number>
}

class OBJLoader {
	constructor() {

	}

	load(file: string, callback: (data: ReturnObject) => void) {
		let lines = file.split("\n");
		let vertices: Array<number> = [];
		let indices: Array<number> = [];
		for(let i = 0; i < lines.length; i++) {
			let line = lines[i];
			// Do nothing if the first line is a comment.
			if(line[0] !== "#") {
				let values = line.split(' ');
				switch(values[0]) {
					// Vertex positions.
					case "v":
						vertices.push(parseFloat(values[1])); // X
						vertices.push(parseFloat(values[2])); // Y
						vertices.push(parseFloat(values[3])); // Z
						break;

					// Vertex indices.
					case "f":
						for(let j = 0; j < values.length-1; j++) {
							indices.push(parseInt(values[j+1]))
						}
						break;
				}
			}
		}
		callback({vertices: vertices, indices: indices});
	}
}

export default OBJLoader;