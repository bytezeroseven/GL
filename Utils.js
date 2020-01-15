
// DON'T DO IT BRO

const defaultTexColor = new Uint8Array([0, 0, 255, 255]);

WebGLRenderingContext.texParameters = function(type, params) {

	for (let key in params) {

		this.texParameteri(type, WebGLRendereringContext[key], params[key]);

	}

	if (params.useMips) {
		this.generateMipmap();
	}

}

WebGLRenderingContext.tex2DSource = function(src, flipY) {

	this.texImage2D(this.TEXTURE_2D, 0, this.RGBA, 1, 1, 0, this.RGBA, this.UNSIGNED_BYTE, defaultTexColor);

	let img = new Image();

	img.onload = () => {

		if (flipY) {
			this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, true);
		}

		this.bindTexture(this.TEXTURE_2D, tex);
		this.texImage2D(this.TEXTURE_2D, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, img);
		this.bindTexture(this.TEXTURE_2D, null);

		if (flipY) {
			this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, false);
		}

	}

	img.src = src;

}

WebGLRenderingContext.texCubeSource = function(srcArr, flipY) {

	for (let i = 0; i < 6; i++) {

		this.texImage2D(this.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.RGBA, 1, 1, 0, this.RGBA, defaultTexColor);

		let img = new Image();

		img.onload = function() {

			if (flipY) {
				this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, true);
			}

			this.bindTexture(this.TEXTURE_CUBE, tex);
			this.texImage2D(this.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, img);
			this.bindTexture(this.TEXTURE_CUBE, null);

			if (flipY) {
				this.pixelStorei(this.UNPACK_FLIP_Y_WEBGL, false);
			}

		}

		img.src = srcArr[i];

	}

}

class Utils {


	static texParameters(gl, type, tex, params) {

		gl.bindTexture(type, tex);

	}

	static createTexture(gl, type, src, flipY, filterMin, filterMag, wrapS, wrapT, wrapR) {

		let tex = gl.createTexture();

		gl.bindTexture(type, tex);

		gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, filterMin || gl.LINEAR);
		gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, filterMag || gl.LINEAR);
		gl.texParameteri(type, gl.TEXTURE_WRAP_S, wrapS || gl.CLAMP_TO_EDGE);
		gl.texParameteri(type, gl.TEXTURE_WRAP_T, wrapT || gl.CLAMP_TO_EDGE);

		if (type === gl.TEXTURE_CUBE) {

			gl.texParameteri(type, gl.TEXTURE_WRAP_R, wrapR || gl.CLAMP_TO_EDGE);

			Utils.textureCubeSource(gl, tex, src, flipY);

		} else if (type === gl.TEXTURE_2D) {

			Utils.texture2DSource(gl, tex, src, flipY);

		}

		if ((filterMag >= gl.NEAREST_MIPMAP_NEAREST && filterMag <= gl.LINEAR_MIPMAP_LINEAR) || 
			(filterMin >= gl.NEAREST_MIPMAP_NEAREST && filterMin <= gl.LINEAR_MIPMAP_LINEAR)) {

			gl.generateMipmap();

		}

		gl.bindTexture(type, null);

		return tex;

	}

	static texture2DSource(gl, tex, src, flipY) {

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, defaultTexColor);

		let img = new Image();
		img.src = src;

		img.onload = function() {

			if (flipY) {
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			}

			gl.bindTexture(gl.TEXTURE_2D, tex);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
			gl.bindTexture(gl.TEXTURE_2D, null);

			if (flipY) {
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
			}

		}

	}

	static textureCubeSource(gl, tex, srcArr, flipY) {

		for (let i = 0; i < 6; i++) {

			gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, defaultTexColor);

			let img = new Image();
			img.src = srcArr[i];

			img.onload = function() {

				if (flipY) {
					gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
				}

				gl.bindTexture(gl.TEXTURE_CUBE, tex);
				gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
				gl.bindTexture(gl.TEXTURE_CUBE, null);

				if (flipY) {
					gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
				}

			}

		}

	}

	static getRandomId() {
		return Math.random().toString(32).slice(2).toUpperCase();
	}

	static createShader(gl, type, src) {

		let shader = gl.createShader(type);
		gl.shaderSource(shader, src);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

			console.warn("Error compiling " + (type == gl.VERTEX_SHADER ? "vertex" : "fragment") + " shader!", gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;

		}

		return shader;

	}

	static createProgram(gl, vShader, fShader, doValidate) {

		let program = gl.createProgram();

		gl.attachShader(program, vShader);
		gl.attachShader(program, fShader);

		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

			console.warn("Error linking program!", gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
			return null; 

		}

		if (doValidate) {
			
			gl.validateProgram(program);
			
			if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {

				console.warn("Error validating program!", gl.getProgramInfoLog(program));
				gl.deleteProgram(program);
				return null;
			
			}
		}

		return program;

	}

	static createProgramFromText(gl, vSrc, fSrc, doValidate) {

		let vShader = Utils.createShader(gl, gl.VERTEX_SHADER, vSrc);
		if (!vShader) {
			return null;
		}

		let fShader = Utils.createShader(gl, gl.FRAGMENT_SHADER, fSrc);
		if (!fShader) {
			return null;
		}

		let program = Utils.createProgram(gl, vShader, fShader, doValidate);
		if (!program) {

			gl.deleteShader(vShader);
			gl.deleteShader(fShader);
			return null;

		}

		return program;

	}

}
