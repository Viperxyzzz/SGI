export class MyComponent {
    constructor(scene){
        this.scene = scene;
        this.id = "";
        this.transformation = mat4.create();
        this.material = null;
        this.texture = null;
        this.primitives = []
        this.children = [];
    }

    addPrimitive(primitive){
        this.primitives.push(primitive);
    }
    
    addChildren(child){
        this.children.push(child);
    }

    getMaterial(){
        return this.material;
    }

    getPrimitives(){
        return this.primitives;
    }

    getChildren(){
        return this.children;
    }
}