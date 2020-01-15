
/**
 * I might be not perfect but plese don't dispose me goat sama
 */

class Renderer {

	constructor(canvas) {

		canvas = canvas || document.createElement("canvas");

		let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

		gl.enable(gl.DEPTH_TEST);
		
		if (!gl) {
		
			console.error("Webgl not supported!");
			return null;
		
		}

		let geometries = {};
		let textures = {};

		// TODO: Geometry class and render it
		// Ples don't remove for god sake
		
		this.renderModel = (geometry, material) => {

			let bufs = geometries[geometry.id];

			if (!bufs) {
				bufs = this.createBuffers(geometry.indices, geometry.vertices, geometry.normals, geometry.uvs);
				geometries[geometry.id] = bufs;
				geometry.needsUpdate = false;
			}

			if (geometry.needsUpdate) {

				this.updateBuffers(bufs, geometry.indices, geometry.vertices, geometry.normals, geometry.uvs);
				geometry.needsUpdate = false;

			}

			if (material.diffuseMap) {
				if (!textures[material.diffuseMap]) {
					textures[material.diffuseMap] = Utils.createTexture(gl, gl.TEXTURE_2D, material.diffuseMap, true);
				}

				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, textures[material.diffuseMap]);
				this.shader.setUniform("texture", 0);
			}

			// this.shader.loadMaterial(material);

			this.renderBuffers(

				bufs, 
				material.drawMode, 
				geometry.indices.length || geometry.vertices.length / 3, 0

			);

			if (material.diffuseMap) {
				gl.bindTexture(gl.TEXTURE_2D, null);
			}

		}

		// Alright, I removed the checks for undefined and length equals zero
		// cos in the long run, I will most often have geometries with everything defined
		// and beside for line geometry, I can think about that later on.
		// 
		// Back at it again nvm
		
		this.createBuffers = (arrInd, arrVert, arrNorm, arrUv) => {

			let bufInd, bufVert, bufNorm, bufUv;

			if (arrInd && arrInd.length > 0) {

				bufInd = gl.createBuffer();
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufInd);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrInd), gl.STATIC_DRAW);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

			}

			bufVert = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, bufVert);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrVert), gl.STATIC_DRAW);

			if (arrNorm && arrNorm.length > 0) {
				
				bufNorm = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, bufNorm);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrNorm), gl.STATIC_DRAW);
			
			}

			if (arrUv && arrUv.length > 0) {

				bufUv = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, bufUv);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrUv), gl.STATIC_DRAW);
			
			}

			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			return [bufInd, bufVert, bufNorm, bufUv];

		}

		this.updateBuffers = (bufs, arrInd, arrVert, arrNorm, arrUv) => {

			gl.deleteBuffer(bufs[0]);
			gl.deleteBuffer(bufs[1]);
			gl.deleteBuffer(bufs[2]);
			gl.deleteBuffer(bufs[3]);

			let b = this.createBuffers(arrInd, arrVert, arrNorm, arrUv);
			bufs[0] = b[0];
			bufs[1] = b[1];
			bufs[2] = b[2];
			bufs[3] = b[3];

		}

		this.renderBuffers = (bufs, drawMode, vertexCount, offset) => {

			let bufInd = bufs[0],
				bufVert = bufs[1],
				bufNorm = bufs[2],
				bufUv = bufs[3];

			if (!bufVert) {
				return false;
			}

			gl.enableVertexAttribArray(0);

			gl.bindBuffer(gl.ARRAY_BUFFER, bufVert);
			gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

			if (bufNorm) {
				gl.bindBuffer(gl.ARRAY_BUFFER, bufNorm);
				gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
				gl.enableVertexAttribArray(1);
			}

			if (bufUv) {
				gl.bindBuffer(gl.ARRAY_BUFFER, bufUv);
				gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
				gl.enableVertexAttribArray(2);
			}

			if (bufInd) {

				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufInd);

				gl.drawElements(
					drawMode, 
					vertexCount - offset, 
					gl.UNSIGNED_SHORT, 
					offset * Uint16Array.BYTES_PER_ELEMENT
				);

				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
				
			} else {

				gl.drawArrays(drawMode, offset, vertexCount);

			}

			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			gl.disableVertexAttribArray(0);

			bufNorm != undefined && gl.disableVertexAttribArray(1);
			bufUv != undefined && gl.disableVertexAttribArray(2);

		}

		this.gl = gl;
		this.canvas = canvas;
		this.shader = null;

	}

	// Will probably load the uniforms in the renderer cos how tf
	// am i gonna set the textures?
	setMaterial(material) {



	}

	useShader(shader) {

		this.shader = shader;
		this.gl.useProgram(shader ? shader.program : null);

	}

	setSize(width, height, updateStyle) {

		if (updateStyle) {
			this.canvas.style.width = width + "px";
			this.canvas.style.height = height + "px";
		}

		this.canvas.width = width;
		this.canvas.height = height;
		this.gl.viewport(0, 0, width, height);

	}

	clear() {

		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	}

}



