import { CGFobject } from '../lib/CGF.js';
/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
export class MyTriangle extends CGFobject {
	constructor(scene, id, x1, x2, y1, y2,x3,y3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
        this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
        this.y3 = y3;
        this.id = id;
        

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
            this.x1,this.y1,0, // 0 
            this.x2,this.y2,0, // 1 
            this.x3,this.y3,0  // 2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			2, 1, 0
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */
		let a = Math.sqrt(Math.pow(this.x1 - this.x3,2) + Math.pow(this.y1 - this.y3,2));
		let b = Math.sqrt(Math.pow(this.x3 - this.x2,2) + Math.pow(this.y3 - this.y2,2));
		let c = Math.sqrt(Math.pow(this.x1 - this.x2,2) + Math.pow(this.y1 - this.y2,2));
		
		let cosAngle = (a * a - b * b + c * c) / (2 * a * c);
		let sinAngle = Math.sqrt(1 - (cosAngle * cosAngle));

		let length_u = 1;//?
		let length_v = 1;

		this.texCoords = [
			0, 0,
			a / length_u, 0,
			c * cosAngle / length_u, c * sinAngle / length_v
		]
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}

