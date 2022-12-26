import { CGFscene, CGFtexture } from '../lib/CGF.js';
import { CGFappearance } from '../lib/CGF.js';
import { MyCylinder } from "./primitives/MyCylinder.js";
import { MySphere } from './primitives/MySphere.js';

export class MyPiece {
    constructor(scene, id, type) {
        this.scene = scene;
        this.id = id;
        this.type = type;
        this.geometry = new MyCylinder(scene, 0.5, 0.5, 0.1, 20, 20);
        this.top = new MyCylinder(scene, 0.5, 0, 0.1, 20, 20);
        this.selectable = true;
        this.tilePointer = null;
        this.isKing = false;
        this.texture = null;
        this.createMaterials();
    }

    createMaterials() {
        this.materialBlack = new CGFappearance(this.scene);
        this.materialBlack.setAmbient(0, 0, 0, 1);
        this.materialBlack.setDiffuse(0, 0.8, 0.3, 1);
        this.materialBlack.setSpecular(0, 0, 0, 1);
        this.materialBlack.setShininess(10.0);


        this.materialWhite = new CGFappearance(this.scene);
        this.materialWhite.setAmbient(0, 0, 0, 1);
        this.materialWhite.setDiffuse(1, 1, 1, 1);
        this.materialWhite.setSpecular(0, 0, 0, 1);
        this.materialWhite.setShininess(10.0);
    }

    setTexture(){
        this.texture = new CGFtexture(this.scene, "scenes/images/wood.jpg");
    }

    unsetTexture(){
        this.texture = null;
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



    display() {
        let m4 = mat4.create();
        if(this.isKing)
            mat4.scale(m4, m4, [1, 1, 3]);
        mat4.translate(m4, m4, [this.tilePointer.x + 0.5, this.tilePointer.y + 0.5, 0]);
        // register the id of the object to be picked
        if(this.selectable)
            this.scene.registerForPick(this.id, this);

        // Now call all the game objects/components/primitives display
        // method that should be selectable and recognized
        // with this uniqueId
        this.scene.pushMatrix();
        this.scene.multMatrix(m4);
        if(this.type == "black"){
            this.materialBlack.setTexture(this.texture);
            this.materialBlack.apply();
        }
        else{
            this.materialWhite.setTexture(this.texture);
            this.materialWhite.apply();
        }
        this.geometry.display();
        this.top.display();
        this.scene.popMatrix();
        // clear the currently registered id and associated object
        if (this.selectable)
            this.scene.clearPickRegistration();
    }
}