import { MyGameOrchestrator } from "./MyGameOrchestrator.js";
import { MyGameSequence } from "./MyGameSequence.js";

export class MyAnimator {
    constructor(scene, orchestrator, sequence) {
        this.scene = scene;
        this.orchestrator = orchestrator;
        this.sequence = sequence;
    }
    
    reset() {
        this.sequence = [];
    }

    start() {
        this.sequence.forEach(move => {
            move.animate();
        });
    }


    update(t) {
        this.sequence.forEach(move => {
            move.update(t);
        });
    }

    display() {
        this.sequence.forEach(move => {
            move.display();
        });
    }
}