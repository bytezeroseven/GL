
// ples don't lel
// 


class Material {

	constructor() {

		this.ambientColor = new Vector3(0, 1, 0);
		this.diffuseColor = new Vector3(1, 0, 0);
		this.specularColor = new Vector3(0, 0, 1);

		this.ambientIntensity = 1;
		this.diffuseIntensity = 1;
		this.specularIntensity = 1;
		
		this.shinniness = 1;

		this.diffuseMap = null;
		this.normalMap = null;
		this.bumpMap = null;
		
		this.color = new Vector3(1, 0, 0);
		this.alpha = 1.0;

		this.drawMode = WebGLRenderingContext.TRIANGLES;

	}

}


class Geometry {

	constructor() {

		this.id = Utils.getRandomId();

		this.indices = [];
		this.vertices = [];
		this.normals = [];
		this.uvs = [];

	}

}


const fSrc = `

precision mediump float;

uniform sampler2D texture;

uniform float lol[10];

varying vec3 fPosition;
varying vec3 fNormal;
varying vec2 fUv;

void main() {

	lol;

	gl_FragColor = texture2D(texture, fUv);

}

`;

const lights = `

struct Material {
	
	vec3 diffuseColor;
	vec3 ambientColor;
	vec3 specularColor;

	float diffuseIntensity;
	float ambientIntensity;
	float specularIntensity;
	float shinniness;

	vec3 color;
	float alpha;

	sampler2D texture;
	sampler2D normal;
	sampler2D bump;

};

uniform Material material;

void main() {
	
	vec3 lightPosition = vec3(0, 0, 4);
	vec3 toLight = lightPosition - fPosition;

	vec3 diffuse = material.diffuseColor * max(dot(toLight, fNormal), 1.) * material.diffuseIntensity;
	vec3 ambient = material.ambientColor * material.ambientIntensity;

	float spec = max(dot(reflect(-toLight, fNormal), fNormal), 1.);
	vec3 specular = pow(spec, material.shinniness) * material.specularColor * material.specularIntensity;

	vec3 shading = (diffuse + ambient + specular) * material.color;

}

`;

const vSrc = `

precision mediump float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec3 fPosition;
varying vec3 fNormal;
varying vec2 fUv;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main() {

	fPosition = position;
	fNormal = normal;
	fUv = uv;

	gl_Position = projection * view * model * vec4(position, 1.0);
	
}

`;



class Texture {


	constructor() {

		this.magFilter = WebGLRenderingContext.LINEAR;
		this.minFilter = WebGLRenderingContext.LINEAR;
		this.wrapS = WebGLRenderingContext.CLAMP_TO_EDGE;
		this.wrapT = WebGLRenderingContext.CLAMP_TO_EDGE;

	}


}


