import { CGFscene } from '../lib/CGF.js';
import { CGFappearance } from '../lib/CGF.js';
import { MyCylinder } from "./primitives/MyCylinder.js";
import { MySphere } from './primitives/MySphere.js';
import { MyCube } from './primitives/MyCube.js';
import { MyPiece } from './MyPiece.js';

export class MyAuxBoard {
    constructor(scene, x, y, z, color) {
        this.scene = scene;
        this.board = new MyCube(this.scene);
        this.x = x;
        this.y = y;
        this.z = z;

        this.lastPieceX = 0;
        this.lastPieceY = 0;

        this.pieces = [];
        this.piecesPosition = [];

        this.materialBlack = new CGFappearance(this.scene);
        this.materialBlack.setAmbient(0, 0, 0, 1);
        this.materialBlack.setDiffuse(0, 0, 0, 1);
        this.materialBlack.setSpecular(0, 0, 0, 1);
        this.materialBlack.setShininess(10.0);

        //create texture
        this.woodTexture = new CGFappearance(this.scene);
        this.woodTexture.setAmbient(0.3, 0.3, 0.3, 1);
        this.woodTexture.setDiffuse(0.7, 0.7, 0.7, 1);
        this.woodTexture.setSpecular(0.0, 0.0, 0.0, 1);
        this.woodTexture.setShininess(120);
        this.woodTexture.loadTexture('scenes/images/woodenBox.jpg');

    }

    addPiece(piece){
        this.pieces.push(piece);
        this.piecesPosition[piece.id] = [this.lastPieceX, this.lastPieceY];
        this.lastPieceY++;
        if(this.lastPieceY == 5){
            this.lastPieceY = 0;
            this.lastPieceX++;
        }
    }

    resetBoard(){
        this.pieces = [];
        this.lastPieceX = 0;
        this.lastPieceY = 0;
    }

    removePiece(){
        this.pieces.pop();
    }

    getNextPiecePosition(){
        return [this.lastPieceX + this.x, this.lastPieceY + this.y];
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.x, this.y, this.z);
        this.scene.scale(2,1,5);
        this.materialBlack.apply();
        this.woodTexture.apply();
        this.board.display();
        this.scene.scale(1/2,1,1/5);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        for(let i = 0; i < this.pieces.length; i++){
            this.pieces[i].display();
        }
            
        this.scene.popMatrix();
    }
}