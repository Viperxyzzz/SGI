import { CGFscene, CGFtexture } from '../lib/CGF.js';
import { CGFappearance } from '../lib/CGF.js';
import { MyCylinder } from "./primitives/MyCylinder.js";
import { MySphere } from './primitives/MySphere.js';
import { MyKeyframeAnimation } from "./MyKeyframeAnimation.js";
import { KeyFrame } from './KeyFrame.js';
import { MyCircle } from './primitives/MyCircle.js';
export class MyPiece {
    constructor(scene, id, type) {
        this.scene = scene;
        // console.log("Piece created: " + id + " " + type);
        this.id = id;
        this.type = type;
        this.geometry = new MyCylinder(scene, 0.5, 0.5, 0.3, 20, 20);
        // this.top = new MySphere(scene, 0.5, 20, 20);
        this.top = new MyCircle(scene, 20);
        this.selectable = true;
        this.tilePointer = null;
        this.auxBoard = null;
        this.isKing = false;
        this.animation = null;
        this.dx = 0;
        this.dy = 0;
        this.createMaterials();
        // this.blackText = new CGFtexture(this.scene, "scenes/images/black.png");
        // this.whiteText = new CGFtexture(this.scene, "scenes/images/white.png");
    }

    createMaterials() {
        this.materialBlack = new CGFappearance(this.scene);
        this.materialBlack.setAmbient(0, 0, 0, 1);
        this.materialBlack.setDiffuse(0.3, 0.3, 0.3, 1);
        this.materialBlack.setSpecular(0, 0, 0, 1);
        this.materialBlack.setShininess(10.0);


        this.materialWhite = new CGFappearance(this.scene);
        this.materialWhite.setAmbient(0, 0, 0, 1);
        this.materialWhite.setDiffuse(1, 1, 1, 1);
        this.materialWhite.setSpecular(0, 0, 0, 1);
        this.materialWhite.setShininess(10.0);
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    setTile(tile) {
        this.tilePointer = tile;
    }

    getTile() {
        return this.tilePointer;
    }

    unsetTile() {
        this.tilePointer = null;
    }

    setKing() {
        this.isKing = true;
    }

    unsetKing() {
        this.isKing = false;
    }

    addEatedAnimation(auxBoard) {
        console.log("EatedAnimation added to " + this.id + " " + this.type);
        console.log("Initial coords: " + this.tilePointer.x + " " + this.tilePointer.y + " " + 0);
        let nextPiecePosition = auxBoard.getNextPiecePosition();
        console.log("nextPiecePosition[0]: " + nextPiecePosition[0] + " nextPiecePosition[1]: " + nextPiecePosition[1])
        console.log("auxBoard.x: " + auxBoard.x + " auxBoard.y: " + auxBoard.y)
        console.log("Final coords are: " + (nextPiecePosition[0] + auxBoard.x) + " " + (nextPiecePosition[1] + auxBoard.y) + " " + auxBoard.z);
        let dx = (nextPiecePosition[0] + auxBoard.x) - this.tilePointer.x;
        let dy = (nextPiecePosition[1] + auxBoard.y) - this.tilePointer.y;
        let dz = auxBoard.z - 0;
        let keyframe = new KeyFrame(0, [0, 0, 0], 0, 0, 0, [1, 1, 1]);
        console.log("Translate needed to achieve the final coords: " + dx + " " + dy + " " + dz);
        let keyframe1 = new KeyFrame(1000, [dx, -dy, dz / 2], 0, 0, 0, [1, 1, 1]);
        console.log("Final coords of animation: " + dx + " " + (-dy) + " " + dz);
        let keyframes = [keyframe, keyframe1];

        var animation = new MyKeyframeAnimation(this.scene, keyframes);

        this.animation = animation;
        this.auxBoard = auxBoard;
        return animation;
    }

    addAnimation(pickedPiece,currentPieceTile, pickedTile, outOfGameAnimation = false){
        let dx = pickedTile.x - currentPieceTile.x;
        let dy = pickedTile.y - currentPieceTile.y;
        let keyframe = new KeyFrame(0, [0,0,0], 0, 0, 0, [1,1,1]);
        let keyframe1 = new KeyFrame(1000, [dx,dy,0], 0, 0, 0, [1,1,1]);

        let keyframes = [keyframe,keyframe1];
        
        // if(eatingAnimation){
        //     let keyframe2 = new KeyFrame(500, [dx/2,dy/2,1], 0, 0, 0, [1,1,1]);
        //     keyframes = [keyframe,keyframe2,keyframe1];
        // }
        // else{
        //     keyframes = [keyframe,keyframe1];
        // }



        var animation = new MyKeyframeAnimation(this.scene, keyframes);

        this.animation = animation;
        this.dx = dx;
        this.dy = dy;
        

        return animation;
    }

    display() {
        let m4 = mat4.create();
        if(this.isKing)
            mat4.scale(m4, m4, [1, 1, 2]);
        if(this.tilePointer == null){
            let x = this.auxBoard.piecesPosition[this.id][0];
            let y = this.auxBoard.piecesPosition[this.id][1];
            mat4.translate(m4, m4, [x + 0.5, -y - 0.5, this.auxBoard.z / 2]);
            if(this.isKing){
                mat4.translate(m4, m4, [0, 0, -0.66]);
            }
        }
        else
            mat4.translate(m4, m4, [this.tilePointer.x + 0.5, this.tilePointer.y + 0.5, 0]);
        if(this.animation != null){
            if(this.animation.ended){
                this.animation = null;
                mat4.translate(m4, m4, [-this.dx, -this.dy, 0]);
            }
        }
        // register the id of the object to be picked
        if(this.selectable)
            this.scene.registerForPick(this.id, this);

        // Now call all the game objects/components/primitives display
        // method that should be selectable and recognized
        // with this uniqueId
        this.scene.pushMatrix();
        this.scene.multMatrix(m4);
        if(this.type == "black"){
            this.materialBlack.apply();
        }
        else{
            this.materialWhite.apply();
        }
        if(this.animation != null){
            this.animation.apply();
        }
        this.geometry.display();
        this.scene.popMatrix();
        if(this.animation != null){
            this.animation.apply();
        }
        m4 = mat4.create();
        if(this.tilePointer == null){
            let x = this.auxBoard.piecesPosition[this.id][0];
            let y = this.auxBoard.piecesPosition[this.id][1];
            mat4.translate(m4, m4, [x + 0.5, -y - 0.5, this.auxBoard.z / 2]);
            if(this.isKing){
                mat4.translate(m4, m4, [0, 0, -0.66]);
            }
        }
        else{
            if(this.isKing)
                mat4.translate(m4, m4, [this.tilePointer.x + 0.5, this.tilePointer.y + 0.5, 0.601]);
            else
                mat4.translate(m4, m4, [this.tilePointer.x + 0.5, this.tilePointer.y + 0.5, 0.301]);
        }
        mat4.scale(m4, m4, [0.5, 0.5, 0.5]);
        mat4.rotate(m4, m4, Math.PI, [1, 0, 0]);

        this.scene.pushMatrix();
        this.scene.multMatrix(m4);
        if(this.type == "black"){
            this.materialBlack.apply();
        }
        else{
            this.materialWhite.apply();
        }

        this.top.display();
        this.scene.popMatrix();
        // clear the currently registered id and associated object
        if (this.selectable)
            this.scene.clearPickRegistration();
    }
}