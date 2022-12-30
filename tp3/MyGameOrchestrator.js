import { MySceneGraph } from "./MySceneGraph.js";
import { MyGameSequence } from "./MyGameSequence.js";
import { MyAnimator } from "./MyAnimator.js";
import { MyGameBoard } from "./MyGameBoard.js";
import { MyAuxBoard } from "./MyAuxBoard.js";
import { MyPiece } from "./MyPiece.js";
import { MyTile } from "./MyTile.js";
import { MyGameMove } from "./MyGameMove.js";
import { MyKeyframeAnimation } from "./MyKeyframeAnimation.js";
import { MyCube } from "./primitives/MyCube.js";
import { CGFappearance, CGFtexture, CGFshader} from "../lib/CGF.js";
import {MyQuad} from "./primitives/MyQuad.js";

export class MyGameOrchestrator {
    constructor(scene) {
        this.undoCube = new MyCube(scene);
        this.changeCamera = new MyCube(scene);
        this.movieCube = new MyCube(scene);

        this.gameSequence = new MyGameSequence(scene);
        this.auxBoardBlack = new MyAuxBoard(scene, -3, 0 , 2);
        this.auxBoardWhite = new MyAuxBoard(scene, 9, 0 ,2);
        this.gameBoard = new MyGameBoard(scene, this.auxBoardWhite, this.auxBoardBlack);

        this.animator = new MyAnimator(scene, this, this.gameSequence);
        this.pickedPiece = null;
        this.pickedTile = null;
        this.movingPiece = null;
        this.isMoving = false;
        this.state = "NEXT_TURN";
        this.isPayerBlack = true;
        this.scene = scene;
        this.hasDoubleJump = false;
        this.gameBoard.setOrchestrator(this);
        this.piece = null;
        this.undoPlay = false;
        this.score = [0,0];



        this.startTime = Date.now() / 1000;
        this.lastTime = this.startTime;




        //textures and materials for the several objects
        this.undoAppearance = new CGFappearance(this.scene);
        this.undoAppearance.setAmbient(0.4, 0.2, 0.1, 0.5);
        this.undoAppearance.setSpecular(0.1, 0.1, 0.1, 0.1);
        this.undoAppearance.setDiffuse(0.8, 0.8, 0.8, 1);
        this.undoAppearance.setShininess(5);
        this.undoAppearance.loadTexture("scenes/images/undo.png");

        this.movieAppearance = new CGFappearance(this.scene);
        this.movieAppearance.setAmbient(0.4, 0.2, 0.1, 0.5);
        this.movieAppearance.setSpecular(0.1, 0.1, 0.1, 0.1);
        this.movieAppearance.setDiffuse(0.8, 0.8, 0.8, 1);
        this.movieAppearance.setShininess(5);
        this.movieAppearance.loadTexture("scenes/images/movie.png");

        this.cameraAppearance = new CGFappearance(this.scene);
        this.cameraAppearance.setAmbient(0.4, 0.2, 0.1, 0.5);
        this.cameraAppearance.setSpecular(0.1, 0.1, 0.1, 0.1);
        this.cameraAppearance.setDiffuse(0.8, 0.8, 0.8, 1);
        this.cameraAppearance.setShininess(5);
        this.cameraAppearance.loadTexture("scenes/images/eye.png");

        // this.scene.gl.clearColor(0.1, 0.1, 0.1, 1.0);
		// this.scene.gl.clearDepth(1000.0);
		// this.scene.gl.enable(this.scene.gl.DEPTH_TEST);
		// this.scene.gl.enable(this.scene.gl.CULL_FACE);
		// this.scene.gl.depthFunc(this.scene.gl.LEQUAL);


        // this.appearance = new CGFappearance(this.scene);

		// // font texture: 16 x 16 characters
		// // http://jens.ayton.se/oolite/files/font-tests/rgba/oolite-font.png
		// this.fontTexture = new CGFtexture(this.scene, "scenes/images/oolite-font.trans.png");
		// this.appearance.setTexture(this.fontTexture);

		// // plane where texture character will be rendered
		// this.quad = new MyQuad(this.scene);
		
		// // instatiate text shader (used to simplify access via row/column coordinates)
		// // check the two files to see how it is done
		// this.textShader=new CGFshader(this.scene.gl, "shaders/font.vert", "shaders/font.frag");

		// // set number of rows and columns in font texture
		// this.textShader.setUniformsValues({'dims': [16, 16]});



    }

    setDoubleJump(bool){
        this.hasDoubleJump = bool;
    }

    update(t) {
        this.animator.update(t);

        if(this.isMoving){
            if(this.movingPiece.animation.ended){
                this.isMoving = false;
                this.movingPiece = null;
                let move = this.gameSequence.sequence[this.gameSequence.sequence.length - 1];
                let value = this.gameBoard.movePiece(move.piece,move.tileFrom,move.tileTo,move.isPlayerBlack);
                this.piece = move.piece;

                if(!this.hasDoubleJump){
                    // change player
                    if(this.isPayerBlack){
                        this.isPayerBlack = false;
                        // this.scene.nextCamera = this.scene.graph.cameras["whiteCamera"];
                    }
                    else{
                        this.isPayerBlack = true;
                        // this.scene.nextCamera = this.scene.graph.cameras["defaultCamera"];
                    }
                
                    // if(this.scene.camera.position[2] == 37){
                    //     this.scene.cameraPosZInc = -1;
                    // }
                    // else{
                    //     this.scene.cameraPosZInc = 1;
                    // }
                    // if(this.scene.camera.target[2] == 0){
                    //     this.scene.cameraTarZInc = 0.1;
                    // }
                    // else{
                    //     this.scene.cameraTarZInc = -0.1;
                    // }

                    // this.scene.cameraAnimation = true;
                    // this.scene.rotateCamera();

                }
            }
        }


        //state machine
        switch(this.state){
            case "MENU":
                // this.drawMenu();
                break;
            case "LOAD_SCENE":
                //this.theme = new MySceneGraph("scenes/tp3/board.xml", scene);
                break;
            case "NEXT_TURN":
                this.display();
                break;
            case "POSSIBLE_MOVES":
                this.drawPossibleMoves(this.pickedPiece);
                break;
            case "ANIMATION":
                break;
            case "UNDO":
                this.undo();
                break;
            case "MOVIE":
                this.movie();
                break;
            case "HAS_GAME_ENDED":
                break;
            case "GAME_OVER":
                console.log("Game Over");
                break;
            default:
                console.log("Error: Invalid state");
                break;
        }
    }

    movie(){
        this.gameBoard.resetBoard();

        for(let i = 0; i < this.gameSequence.sequence.length; i++){
            let move = this.gameSequence.sequence[i];
            this.gameBoard.movePiece(move.piece,move.tileFrom,move.tileTo,move.isPlayerBlack);
        }
        
        this.isPayerBlack = true;
    }

    undo(){
        let move = this.gameSequence.undo();
        if(move != null){
            this.undoPlay = true;
            this.gameBoard.movePiece(move.piece,move.tileTo,move.tileFrom,move.isPlayerBlack);
            if(move.capturedPiece !== null){
                this.gameBoard.addPiecetoTile(move.capturedPiece, move.tileCaptured);
                if(move.isPlayerBlack){
                    this.auxBoardWhite.removePiece();
                    this.score[0]--;
                }
                else{
                    this.auxBoardBlack.removePiece();
                    this.score[1]--;
                }
            }
            this.isPayerBlack = move.isPlayerBlack;
        }
    }


    clearPossibleMoves(){
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if(this.gameBoard.getTileByCoords(i, j).getMaterialApplied() == "green"){
                    if(this.gameBoard.getTileByCoords(i,j).x % 2 == this.gameBoard.getTileByCoords(i,j).y % 2){
                        this.gameBoard.getTileByCoords(i, j).setMaterialApplied("black");
                    }
                    else{
                        this.gameBoard.getTileByCoords(i, j).setMaterialApplied("white");
                    }
                }
            }
        }
    }

    drawObjects(){
        this.scene.pushMatrix();
        this.scene.translate(-2, 0, 0);
        this.scene.registerForPick(9, this.undoCube);
        this.undoAppearance.apply();
        this.undoCube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2, 0, -2);
        this.scene.registerForPick(99, this.movieCube);
        this.movieAppearance.apply();
        this.movieCube.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-2, 0, -4);
        this.scene.registerForPick(999, this.changeCamera);
        this.cameraAppearance.apply();
        this.changeCamera.display();
        this.scene.popMatrix();
    }

    drawPossibleMoves(pickedPiece){
        if(this.isPayerBlack){

            //check the squares to the top-left and top-right of the current position
            if(pickedPiece.getTile().x - 1 >= 0 && pickedPiece.getTile().x - 1 <= 7 && pickedPiece.getTile().y - 1 >= 0 && pickedPiece.getTile().y - 1 <= 7 && this.gameBoard.getTileByCoords(pickedPiece.getTile().x - 1, pickedPiece.getTile().y - 1).getPiece() == null){
                this.gameBoard.getTileByCoords(pickedPiece.getTile().x - 1, pickedPiece.getTile().y - 1).setMaterialApplied("green");
            }
            if (pickedPiece.getTile().x + 1 <= 7 && pickedPiece.getTile().x + 1 >= 0 && pickedPiece.getTile().y - 1 >= 0 && pickedPiece.getTile().y - 1 <= 7 && this.gameBoard.getTileByCoords(pickedPiece.getTile().x + 1, pickedPiece.getTile().y - 1).getPiece() == null){
                this.gameBoard.getTileByCoords(pickedPiece.getTile().x + 1, pickedPiece.getTile().y - 1).setMaterialApplied("green");
            }

            // Check for pieces that can be captured by jumping
            if(pickedPiece.getTile().x - 2 >= 0 && pickedPiece.getTile().y - 2 >= 0 && pickedPiece.getTile().x - 2 <= 7 && pickedPiece.getTile().y - 2 <= 7 && this.gameBoard.getTileByCoords(pickedPiece.getTile().x - 2, pickedPiece.getTile().y - 2).getPiece() == null){
                if(this.gameBoard.getTileByCoords(pickedPiece.getTile().x - 1, pickedPiece.getTile().y - 1).getPiece() != null && this.gameBoard.getTileByCoords(pickedPiece.getTile().x - 1, pickedPiece.getTile().y - 1).getPiece().type == "white"){
                    this.gameBoard.getTileByCoords(pickedPiece.getTile().x - 2, pickedPiece.getTile().y - 2).setMaterialApplied("green");
                }
            }

            if(pickedPiece.getTile().x + 2 <= 7 && pickedPiece.getTile().y - 2 >= 0 && pickedPiece.getTile().x + 2 >= 0 && pickedPiece.getTile().y - 2 <= 7 && this.gameBoard.getTileByCoords(pickedPiece.getTile().x + 2, pickedPiece.getTile().y - 2).getPiece() == null){
                if(this.gameBoard.getTileByCoords(pickedPiece.getTile().x + 1, pickedPiece.getTile().y - 1).getPiece() != null && this.gameBoard.getTileByCoords(pickedPiece.getTile().x + 1, pickedPiece.getTile().y - 1).getPiece().type == "white"){
                    this.gameBoard.getTileByCoords(pickedPiece.getTile().x + 2, pickedPiece.getTile().y - 2).setMaterialApplied("green");
                }
            }
        }
        else{

            //check the squares to the top-left and top-right of the current position
            if(pickedPiece.getTile().x - 1 >= 0 && pickedPiece.getTile().x - 1 <= 7 && pickedPiece.getTile().y + 1 >= 0 && pickedPiece.getTile().y + 1 <= 7 && this.gameBoard.getTileByCoords(pickedPiece.getTile().x - 1, pickedPiece.getTile().y + 1).getPiece() == null){
                this.gameBoard.getTileByCoords(pickedPiece.getTile().x - 1, pickedPiece.getTile().y + 1).setMaterialApplied("green");
            }
            if (pickedPiece.getTile().x + 1 <= 7 && pickedPiece.getTile().y + 1 <= 7 && pickedPiece.getTile().x + 1 >= 0 && pickedPiece.getTile().y + 1 >= 0 && this.gameBoard.getTileByCoords(pickedPiece.getTile().x + 1, pickedPiece.getTile().y + 1).getPiece() == null){
                this.gameBoard.getTileByCoords(pickedPiece.getTile().x + 1, pickedPiece.getTile().y + 1).setMaterialApplied("green");
            }

            // Check for pieces that can be captured by jumping
            if(pickedPiece.getTile().x - 2 >= 0 && pickedPiece.getTile().y + 2 <= 7 && pickedPiece.getTile().x - 2 <= 7 && pickedPiece.getTile().y + 2 >= 0 && this.gameBoard.getTileByCoords(pickedPiece.getTile().x - 2, pickedPiece.getTile().y + 2).getPiece() == null){
                if(this.gameBoard.getTileByCoords(pickedPiece.getTile().x - 1, pickedPiece.getTile().y + 1).getPiece() != null && this.gameBoard.getTileByCoords(pickedPiece.getTile().x - 1, pickedPiece.getTile().y + 1).getPiece().type == "black"){
                    this.gameBoard.getTileByCoords(pickedPiece.getTile().x - 2, pickedPiece.getTile().y + 2).setMaterialApplied("green");
                }
            }

            if(pickedPiece.getTile().x + 2 <= 7 && pickedPiece.getTile().y + 2 <= 7 && pickedPiece.getTile().x + 2 >= 0 && pickedPiece.getTile().y + 2 >= 0 && this.gameBoard.getTileByCoords(pickedPiece.getTile().x + 2, pickedPiece.getTile().y + 2).getPiece() == null){
                if(this.gameBoard.getTileByCoords(pickedPiece.getTile().x + 1, pickedPiece.getTile().y + 1).getPiece() != null && this.gameBoard.getTileByCoords(pickedPiece.getTile().x + 1, pickedPiece.getTile().y + 1).getPiece().type == "black"){
                    this.gameBoard.getTileByCoords(pickedPiece.getTile().x + 2, pickedPiece.getTile().y + 2).setMaterialApplied("green");
                }
            }
        }

        // check if the piece is a king
        if(pickedPiece.isKing == true){
            this.renderKingMoves(pickedPiece, this.isPayerBlack);
        }
        this.state = "NEXT_TURN";
    }

    renderKingMoves(pickedPiece, isPlayerBlack){
        for(let dx = -1; dx <= 1; dx+=2){
            for(let dy = -1; dy <= 1; dy+=2){
                let i = pickedPiece.getTile().x + dx;
                let j = pickedPiece.getTile().y + dy;

                while(i >= 0 && i < 8 && j >= 0 && j < 8){
                    if(this.gameBoard.getTileByCoords(i, j).getPiece() != null){
                        if(this.gameBoard.getTileByCoords(i, j).getPiece().type == pickedPiece.type)
                            break;
                        else{
                            if(i + dx >= 0 && i + dx < 8 && j + dy >= 0 && j + dy < 8 && this.gameBoard.getTileByCoords(i + dx, j + dy).getPiece() == null){
                                this.gameBoard.getTileByCoords(i + dx, j + dy).setMaterialApplied("green");
                                break;
                            }
                            else
                                break;
                        }
                    }
                    this.gameBoard.getTileByCoords(i, j).setMaterialApplied("green");
                    i += dx;
                    j += dy;
                }
            }
        }
    }

    display() {
        //this.theme.display();

        // Clear image and depth buffer every time we update the scene
		// this.scene.gl.viewport(0, 0, this.scene.gl.canvas.width, this.scene.gl.canvas.height);
		// this.scene.gl.clear(this.scene.gl.COLOR_BUFFER_BIT | this.scene.gl.DEPTH_BUFFER_BIT);
		// this.scene.gl.enable(this.scene.gl.DEPTH_TEST);

        // Initialize Model-View matrix as identity (no transformation
		// this.scene.updateProjectionMatrix();
		// this.scene.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
		// this.scene.applyViewMatrix();
		
		// Update all lights used
		// this.scene.lights[0].update();

        // this.scene.setActiveShaderSimple(this.textShader);

        // this.scene.gl.disable(this.scene.gl.DEPTH_TEST);

        // this.appearance.apply();
        // this.scene.pushMatrix();
        //     this.scene.loadIdentity();

        //     this.scene.translate(-1,0,-50);
        //     this.scene.scale(1.5,1.5,1.5);
		// 	this.scene.activeShader.setUniformsValues({'charCoords': [0 + this.score[0], 3]});	
		// 	this.quad.display();

        //     this.scene.translate(1,0,0);
		// 	this.scene.activeShader.setUniformsValues({'charCoords': [0 + this.score[1], 3]});	
		// 	this.quad.display();

        // this.scene.popMatrix();

        
		// re-enable depth test 
		// this.scene.gl.enable(this.scene.gl.DEPTH_TEST);

        // this.scene.setActiveShaderSimple(this.scene.defaultShader);
        
        this.scene.pushMatrix();
            this.scene.translate(9, 0.1, 13.5);
            this.scene.scale(0.3, 0.3, 0.3);
            this.gameBoard.display();
            this.auxBoardBlack.display();
            this.auxBoardWhite.display();
            this.drawObjects();
        this.scene.popMatrix();

    }

    managePick(pickMode, results) {
        if(pickMode == false)
            return;
        if (results != null && results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var obj = results[i][0];
                if (obj) {
                    var customId = results[i][1];
                    // console.log("Picked object: " + obj + ", with pick id " + customId);
                    this.OnObjectSelected(obj, customId);
                }
            }
            results.splice(0, results.length);
        }
    }

    OnObjectSelected(obj, customId) {
        //wait till animation is over
        if(this.isMoving)
            return;
        if (obj instanceof MyPiece) {
            if(this.pickedPiece != null){
                this.pickedPiece = null;
                this.clearPossibleMoves();
                console.warn("Select a valid tile to move the piece");
            }
            else{
                // verify if the piece equals turn player
                if(this.isPayerBlack && obj.type == "black" || !this.isPayerBlack && obj.type == "white"){
                    this.pickedPiece = obj;
                    if(this.pickedPiece !== this.piece && this.hasDoubleJump){
                        this.pickedPiece = null;
                        console.warn("Select the same piece to double jump");
                        return;
                    }
                    else{
                        this.piece = this.pickedPiece;
                    }
                    this.state = "POSSIBLE_MOVES";
                }

            }
        }
        else if (obj instanceof MyTile) {
            // do something with the tile  
            if(this.pickedPiece != null){
                this.pickedTile = obj;
                if(this.gameBoard.isValidMove(this.pickedPiece, this.pickedPiece.getTile(), this.pickedTile, this.isPayerBlack)){
                    let isEating = this.gameBoard.isEating(this.pickedPiece, this.pickedPiece.getTile(), this.pickedTile);
                    if(isEating){
                        var eatedPiece = this.gameBoard.getEatedPiece(this.pickedPiece.getTile(), this.pickedTile);
                        //add auxboard based on color
                        console.log("Eating piece: " + eatedPiece);
                        if(eatedPiece.type == "white"){
                            this.animator.addAnimation(eatedPiece.addEatedAnimation(this.auxBoardWhite));
                            this.score[0]++;
                        }
                        else{
                            this.animator.addAnimation(eatedPiece.addEatedAnimation(this.auxBoardBlack));
                            this.score[1]++;
                        }
                        this.gameSequence.addMove(new MyGameMove(this.scene, this.pickedPiece, this.pickedPiece.getTile(), this.pickedTile, this.gameBoard,this.isPayerBlack, eatedPiece, eatedPiece.getTile()));
                    }
                    else{
                        this.gameSequence.addMove(new MyGameMove(this.scene, this.pickedPiece, this.pickedPiece.getTile(), this.pickedTile, this.gameBoard,this.isPayerBlack));
                    }

                    this.animator.addAnimation(this.pickedPiece.addAnimation(this.pickedPiece, this.pickedPiece.getTile(), this.pickedTile));
                    this.movingPiece = this.pickedPiece;
                    this.isMoving = true;
                }
                this.pickedPiece = null;
                this.pickedTile = null;
                this.clearPossibleMoves();
            }
            else{
                console.log("Select a piece first");
            }
        }
        else if(obj instanceof MyCube){
            if(customId == 9){
                this.undo();
            }
            else if(customId == 99){
                this.movie();
            }
            else if(customId == 999){
                // this.changeCamera();
            }
        }
        else {
            console.warn("Error: Picked object is not a piece or a tile");
        }
    }
}