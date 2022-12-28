import { MyRectangle } from "./MyRectangle.js";
import { CGFappearance } from '../../lib/CGF.js';

export class MyCube{
    constructor(scene){
        this.scene = scene;
        this.face = new MyRectangle(scene,1,0,1,0,1);
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
    };

    display(){
        //frente
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 1); 
        this.materialBlack.apply();
        this.woodTexture.apply();
        this.face.display();
        this.scene.popMatrix();
    
        //tras
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI, 0, 1, 0);
        this.scene.translate(-1, 0, 0);
        this.face.display();
        this.scene.popMatrix();

        //esquerda
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        //this.scene.translate(0, 0, 0);
        this.face.display();
        this.scene.popMatrix();
        
        //direita
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.translate(-1, 0, 1);
        this.face.display();
        this.scene.popMatrix();

        //cima
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.translate(0, -1, 1);
        this.face.display();
        this.scene.popMatrix();

        //baixo
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        //this.scene.translate(0, 0, 0.1);
        this.face.display();
        this.scene.popMatrix();
    }


}