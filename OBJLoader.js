class OBJLoader {

	constructor() {

		this.v = [];
		this.vn = [];
		this.vt = [];

		this.line = null;
		this.fCache = {};
		this.index = 0;

		this.vertices = [];
		this.normals = [];
		this.uvs = [];
		this.indices = [];

	}

	parseText(text) {

		this.clear();

		let lines = text.split("\n");

		for (let i = 0; i < lines.length; i++) {

			this.line = lines[i].trim();
			this.parseLine();

		}

		return [this.indices, this.vertices, this.normals, this.uvs];
		
	}

	clear() {

		this.v = [];
		this.vn = [];
		this.vt = [];

		this.index = 0;
		this.fCache = {};
		this.line = null;

		this.indices = [];
		this.vertices = [];
		this.normals = [];
		this.uvs = [];

	}

	load(url, onLoad) {

		let xhr = new XMLHttpRequest();

		xhr.open("GET", url);

		xhr.onreadystatechange = () => {

			if (xhr.readyState === XMLHttpRequest.DONE) {
				onLoad(this.parseText(xhr.responseText));
			}

		}

		xhr.send(null);

	}

	parseLine() {

		let items = this.line.split(" ");
		items.shift();

		if (this.line.charAt(0) == "v") {

			this.parseVertex();

		} else if (this.line.charAt(0) == "f") {

			this.parseFace();

		}

	}

	parseVertex() {

		let items = this.line.split(" ");
		items.shift();

		switch (this.line.charAt(1)) {

			case " ": this.v.push(parseFloat(items[0]), parseFloat(items[1]), parseFloat(items[2])); break;
			case "n": this.vn.push(parseFloat(items[0]), parseFloat(items[1]), parseFloat(items[2])); break;
			case "t": this.vt.push(parseFloat(items[0]), parseFloat(items[1])); break;

		}

	}

	parseFace() {

		let items = this.line.split(" ");
		items.shift();

		for (let i = 1; i < items.length-1; i ++) {

			this.addVertex(items[0]);
			this.addVertex(items[i]);
			this.addVertex(items[i+1]);

		}

	}

	addVertex(vertexData) {

		if (this.fCache[vertexData] !== undefined) {

			this.indices.push(this.fCache[vertexData]);

		} else {

			let items = vertexData.split("/");
			let i = null;

			i = (parseInt(items[0]) - 1) * 3;
			this.vertices.push(this.v[i], this.v[i+1], this.v[i+2]);

			if (items[1] != "") {
				i = (parseInt(items[1]) - 1) * 2;
				this.uvs.push(this.vt[i], this.vt[i+1]);
			}

			if (items[2] != "") {
				i = (parseInt(items[2]) - 1) * 3;
				this.normals.push(this.vn[i], this.vn[i+1], this.vn[i+2]);
			}

			this.indices.push(this.index);
			this.fCache[vertexData] = this.index;
			this.index++;

		}

	}

}