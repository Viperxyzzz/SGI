import { CGFscene } from '../lib/CGF.js';
import { CGFappearance } from '../lib/CGF.js';
import { MyCylinder } from "./primitives/MyCylinder.js";
import { MySphere } from './primitives/MySphere.js';
import { MyCube } from './primitives/MyCube.js';

export class MyAuxBoard {
    constructor(scene, x, y, z) {
        this.scene = scene;
        this.board = new MyCube(this.scene);
        this.x = x;
        this.y = y;
        this.z = z;
        this.pieces = [];
    }

    addPiece(piece){
        this.pieces.push(piece);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);
        this.scene.scale(1,1,5);
        this.board.display();
        

        this.scene.popMatrix();
    }
}