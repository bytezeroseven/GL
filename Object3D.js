

class Object3D {

	constructor() {

		this.id = Utils.getRandomId();

		this.position = new Vector3();
		this.rotation = new Vector3();
		this.rotation.order = "XYZ";

		this.scale = new Vector3(1, 1, 1);

		this.matrix = new Matrix4();

		this.localXAxis = new Vector3(1, 0, 0);
		this.localYAxis = new Vector3(0, 1, 0);
		this.localZAxis = new Vector3(0, 0, 1)

	}

	translateX(a) {

		this.position.x += this.localXAxis.x * a;
		this.position.y += this.localXAxis.y * a;
		this.position.z += this.localXAxis.z * a;

	}

	translateY(a) {

		this.position.x += this.localYAxis.x * a;
		this.position.y += this.localYAxis.y * a;
		this.position.z += this.localYAxis.z * a;

	}
	
	translateZ(a) {

		this.position.x += this.localZAxis.x * a;
		this.position.y += this.localZAxis.y * a;
		this.position.z += this.localZAxis.z * a;

	}

	updateDirection() {

		this.localXAxis.set(this.matrix.elements[0], this.matrix.elements[1], this.matrix.elements[2]);
		this.localYAxis.set(this.matrix.elements[4], this.matrix.elements[5], this.matrix.elements[6]);
		this.localZAxis.set(this.matrix.elements[8], this.matrix.elements[9], this.matrix.elements[10]);

	}

	updateMatrix() {

		this.matrix.identity();
	
		this.matrix.rotate(this.rotation.x, this.rotation.y, this.rotation.z, this.rotation.order);

		this.matrix.scale(this.scale.x, this.scale.y, this.scale.z);
		this.matrix.translate(this.position.x, this.position.y, this.position.z);

		this.updateDirection();

	}




}


class Mesh extends Object3D {

	constructor(geometry, material) {

		super();

		this.geometry = geometry;
		this.material = material;

	}

}


class Camera extends Object3D {


	constructor() {

		super();
		this.projectionMatrix = new Matrix4();

	}

	updateProjectionMatrix() {

		this.projectionMatrix.identity();

	}

	updateMatrix() {

		this.matrix.identity();

		// Optimization: no scale 
		this.matrix.rotate(this.rotation.x, this.rotation.y, this.rotation.z, this.rotation.order);
		this.matrix.translate(this.position.x, this.position.y, this.position.z);

		this.updateDirection();

		this.matrix.invert();

	}

}

class PerspectiveCamera extends Camera {


	constructor(fov, aspect, near, far) {

		super();
		this.projectionMatrix.perspective(fov, aspect, near, far);

		this.fov = fov;
		this.aspect = aspect;
		this.near = near;
		this.far = far;

	}

	updateProjectionMatrix() {

		this.projectionMatrix.perspective(this.fov, this.aspect, this.near, this.far);

	}

}


class OrthographicCamera extends Camera {

	constructor(w, h, d) {

		super();
		this.projectionMatrix.orthographic(w, h, d);

		this.width = w;
		this.height = h;
		this.depth = d;

	}

	updateProjectionMatrix() {

		this.projectionMatrix.orthographic(this.width, this.height, this.depth);

	}

}
