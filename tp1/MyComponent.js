export class MyComponent {
    constructor(scene){
        this.scene = scene;
        this.id = "";
        this.transformation = null;
        this.material = null;
        this.texture = null;
        this.children = [];
    }

    display(){
        for(var i = 0; i < this.children.length; i++){
        
            this.scene.pushMatrix();
            this.scene.multMatrix(this.transformation);
            this.children[i].display();
            this.scene.popMatrix();
        
        }
    }
}