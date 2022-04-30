interface ReturnObject {
	vertices: Array<number>,
	indices: Array<number>,
	textureCoordinates: Array<number>,
	normals: Array<number>
}

interface Options {
	name: string | undefined,
	index: number
}

class OBJLoader {
	constructor() {

	}

	load(file: string, callback: (data: ReturnObject) => void, opts: Options = {name: undefined, index: 0}) {
		let objects = file.split("\no ")
		console.log(objects);
		let lines = objects[opts.index+1].split("\n");

		

		let OBJdata = {
			vertices: [],
			indices: [],
			textureCoordinates: [],
			normals: []
		} as ReturnObject;

		for(let i = 0; i < lines.length; i++) {
			let line = lines[i];
			// Do nothing if the first line is a comment.
			if(line[0] !== "#") {
				let values = line.split(' ');
				switch(values[0]) {
					// Vertex positions.
					case "v":
						OBJdata.vertices.push(parseFloat(values[1])); // X
						OBJdata.vertices.push(parseFloat(values[2])); // Y
						OBJdata.vertices.push(parseFloat(values[3])); // Z
						break;

					// Vertex indices.
					case "f":
						OBJdata.indices.push(parseInt(values[1])-1)
						OBJdata.indices.push(parseInt(values[2])-1)
						OBJdata.indices.push(parseInt(values[3])-1)
						// OBJdata.indices.push(parseInt(values[4]))
						// for(let j = 0; j < values.length-1; j++) {
						// 	let splitValues = values[j+1].split('/')
						// 	OBJdata.indices.push(parseInt(splitValues[0]))
						// 	OBJdata.indices.push(parseInt(splitValues[1]))
						// 	OBJdata.indices.push(parseInt(splitValues[2]))
						// }
						break;
					
					// Texture coords.
					case "vt":
						OBJdata.textureCoordinates.push(parseFloat(values[1]))
						OBJdata.textureCoordinates.push(parseFloat(values[2]))
						break;

					// Vertex normals.
					case "vn":
						OBJdata.normals.push(parseFloat(values[1]))
						OBJdata.normals.push(parseFloat(values[2]))
						OBJdata.normals.push(parseFloat(values[3]))
						break;
				}
			}
		}
		
		callback(OBJdata);
	}

	loadMultiple(file: string, callback: (data) => void) {
		let objectList = file.split("\no ")
		let objects = {};
		for(let i = 0; i < objectList.length; i++) {
			let lines = objectList[i+1].split("\n");
			let OBJdata = {
				vertices: [],
				indices: [],
				textureCoordinates: [],
				normals: []
			} as ReturnObject;
	
			for(let i = 0; i < lines.length; i++) {
				let line = lines[i];
				// Do nothing if the first line is a comment.
				if(line[0] !== "#") {
					let values = line.split(' ');
					switch(values[0]) {
						// Vertex positions.
						case "v":
							OBJdata.vertices.push(parseFloat(values[1])); // X
							OBJdata.vertices.push(parseFloat(values[2])); // Y
							OBJdata.vertices.push(parseFloat(values[3])); // Z
							break;
	
						// Vertex indices.
						case "f":
							OBJdata.indices.push(parseInt(values[1])-1)
							OBJdata.indices.push(parseInt(values[2])-1)
							OBJdata.indices.push(parseInt(values[3])-1)
							// OBJdata.indices.push(parseInt(values[4]))
							// for(let j = 0; j < values.length-1; j++) {
							// 	let splitValues = values[j+1].split('/')
							// 	OBJdata.indices.push(parseInt(splitValues[0]))
							// 	OBJdata.indices.push(parseInt(splitValues[1]))
							// 	OBJdata.indices.push(parseInt(splitValues[2]))
							// }
							break;
						
						// Texture coords.
						case "vt":
							OBJdata.textureCoordinates.push(parseFloat(values[1]))
							OBJdata.textureCoordinates.push(parseFloat(values[2]))
							break;
	
						// Vertex normals.
						case "vn":
							OBJdata.normals.push(parseFloat(values[1]))
							OBJdata.normals.push(parseFloat(values[2]))
							OBJdata.normals.push(parseFloat(values[3]))
							break;
					}
				}
			}
		}
	}
}

export default OBJLoader;