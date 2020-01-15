
/**
 * Please don't dispose me
 */

class Shader {

	constructor(gl, vSrc, fSrc, doValidate) {

		let program = Utils.createProgramFromText(gl, vSrc, fSrc, doValidate);
		if (!program) {
			return false;
		}

		this.gl = gl;
		this.program = program;

		this.attributes = {};

		let n, info;

		n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

		while (n--) {

			info = gl.getActiveAttrib(program, n);

			this.attributes[info.name] = {
				location: n,
				activeInfo: info
			};

		}

		this.uniforms = {};

		n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

		while (n--) {

			info = gl.getActiveUniform(program, n);

			this.uniforms[info.name] = {
				location: gl.getUniformLocation(program, info.name),
				activeInfo: info
			};

		}

		// Please don't dispose me, i sure you can find a way to optimize me if you say that i am not optimized!

		// LOL please don't 

	}

	setUniform(name, data) {

		if (!this.uniforms[name]) {
			
			console.warn("Can't set uniform: '" + name + "' was not found!");
			return false;

		}

		let loc = this.uniforms[name].location;
		data = new Float32Array(data);

		switch (this.uniforms[name].activeInfo.type) {

			case this.gl.INT: 
			case this.gl.SAMPLER_2D:
			case this.gl.SAMPLER_CUBE:
				this.gl.uniform1i(loc, data); 
				break;

			case this.gl.FLOAT: this.gl.uniform1f(loc, data); break;
			case this.gl.INT_VEC2: this.gl.uniform2iv(loc, data); break;
			case this.gl.INT_VEC3: this.gl.uniform3iv(loc, data); break;
			case this.gl.INT_VEC4: this.gl.uniform3iv(loc, data); break;
			
			case this.gl.FLOAT_VEC2: this.gl.uniform2fv(loc, data); break;
			case this.gl.FLOAT_VEC3: this.gl.uniform3fv(loc, data); break;
			case this.gl.FLOAT_VEC4: this.gl.uniform3fv(loc, data); break;
			
			case this.gl.FLOAT_MAT2: this.gl.uniformMatrix2fv(loc, false, data); break;
			case this.gl.FLOAT_MAT3: this.gl.uniformMatrix3fv(loc, false, data); break;
			case this.gl.FLOAT_MAT4: this.gl.uniformMatrix4fv(loc, false, data); break;
			
		}

	}

	preRender(material) {

		this.setUniform("material.ambientColor", material.ambientColor.toArray());
		this.setUniform("material.diffuseColor", material.diffuseColor.toArray());
		this.setUniform("material.specularColor", material.diffuseColor.toArray());

		this.setUniform("material.ambientIntensity", material.ambientIntensity);		
		this.setUniform("material.diffuseIntensity", material.diffuseIntensity);
		this.setUniform("material.specularIntensity", material.specularIntensity);

		this.setUniform("material.shinniness", material.shinniness);

		this.setUniform("material.color", material.color.toArray());
		this.setUniform("material.alpha", material.alpha);
		
		/*this.gl.activeTexture(0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, )
		this.setUniform("material.texture", 0);
		
		this.gl.activeTexture(1);
		this.setUniform("material.normal", 1);
		
		this.gl.activeTexture(2);
		this.setUniform("material.bump", 2);*/

	}

	loadMVP(model, view, projection) {

		this.setUniform("model", model.toArray());
		this.setUniform("view", view.toArray());
		this.setUniform("projection", projection.toArray());

	}

	dispose() {

		if (this.this.gl.getParameter(this.this.gl.CURRENT_PROGRAM) == this.program) {
			this.this.gl.useProgram(null);
		}

		this.this.gl.deleteProgram(this.program);

	}

}


