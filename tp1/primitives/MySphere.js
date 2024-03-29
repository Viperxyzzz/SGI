import {CGFobject} from '../../lib/CGF.js';

export class MySphere extends CGFobject {
  /**
   * @method constructor
   * @param  {CGFscene} scene - MyScene object
   * @param  {integer} slices - number of slices around Y axis
   * @param  {integer} stacks - number of stacks along Y axis, from the center to the poles (half of sphere)
   */
  constructor(scene, radius, slices, stacks) {
    super(scene);
    this.radius = radius;
    this.latDivs = stacks;
    this.longDivs = slices;

    this.initBuffers();
  }

  /**
   * @method initBuffers
   * Initializes the sphere buffers
   * TODO: DEFINE TEXTURE COORDINATES
   */
  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var phi = 0;
    var theta = 0;
    var phiInc = (2 * Math.PI) / this.latDivs;
    var thetaInc = (2 * Math.PI) / this.longDivs;
    var latVertices = this.longDivs + 1;

    // build an all-around stack at a time, starting on "north pole" and proceeding "south"
    for (let latitude = 0; latitude <= this.latDivs; latitude++) {
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);

      // in each stack, build all the slices around, starting on longitude 0
      theta = 0;
      for (let longitude = 0; longitude <= this.longDivs; longitude++) {
        //--- Vertices coordinates
        var x = this.radius * Math.sin(-theta) * sinPhi;
        var y = this.radius * Math.cos(theta) * sinPhi;
        var z = this.radius * cosPhi;
        this.vertices.push(x, y, z);

        //--- Indices
        if (latitude < this.latDivs && longitude < this.longDivs) {
          var current = latitude * latVertices + longitude;
          var next = current + latVertices;
          // pushing two triangles using indices from this round (current, current+1)
          // and the ones directly south (next, next+1)
          // (i.e. one full round of slices ahead)
          
          this.indices.push( current + 1, current, next);
          this.indices.push( current + 1, next, next +1);
        }

        //--- Normals
        // at each vertex, the direction of the normal is equal to 
        // the vector from the center of the sphere to the vertex.
        // in a sphere of radius equal to one, the vector length is one.
        // therefore, the value of the normal is equal to the position vectro
        this.normals.push(x/this.radius, y/this.radius, z/this.radius);
        theta += thetaInc;

        //--- Texture Coordinates
        // To be done... 
        // May need some additional code also in the beginning of the function.
        this.texCoords.push(longitude/this.longDivs, (latitude * 2)/this.latDivs);
        
      }
      phi += phiInc;
    }


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
  updateTexCoords(coords){
      //doesn't need to do anything
  }

}