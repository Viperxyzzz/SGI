import { MySceneGraph } from "./MySceneGraph.js";
import { MyGameSequence } from "./MyGameSequence.js";
import { MyAnimator } from "./MyAnimator.js";
import { MyGameBoard } from "./MyGameBoard.js";
import { MyAuxBoard } from "./MyAuxBoard.js";
import { MyPiece } from "./MyPiece.js";
import { MyTile } from "./MyTile.js";
import { MyGameMove } from "./MyGameMove.js";
import { MyKeyframeAnimation } from "./MyKeyframeAnimation.js";

export class MyGameOrchestrator {
    constructor(scene) {
        this.gameSequence = new MyGameSequence(scene);
        this.auxBoardBlack = new MyAuxBoard(scene, -2, 0 , 2);
        this.auxBoardWhite = new MyAuxBoard(scene, 9, 0 ,2);
        this.gameBoard = new MyGameBoard(scene, this.auxBoardWhite, this.auxBoardBlack);
        //this.theme = new MySceneGraph("scenes/tp3/board.xml", scene);
        this.animator = new MyAnimator(scene, this, this.gameSequence);
        this.pickedPiece = null;
        this.pickedTile = null;
        this.movingPiece = null;
        this.isMoving = false;
        this.state = "MENU";
        this.isPayerBlack = true;
        this.scene = scene;

        this.startTime = Date.now() / 1000;
        this.lastTime = this.startTime;
    }

    update(t) {
        this.animator.update(t);

        if(this.isMoving){
            if(this.movingPiece.animation.ended){
                this.isMoving = false;
                this.movingPiece = null;
                let move = this.gameSequence.sequence[this.gameSequence.sequence.length - 1];
                console.log("FINAL (X,Y): ");
                console.log(move.tileFrom.x);
                console.log(move.tileFrom.y);
                let dx = move.tileTo.x - move.tileFrom.x;
                let dy = move.tileTo.y - move.tileFrom.y;
                // move.piece.tilePointer.x -= dx;
                // move.piece.tilePointer.y -= dy;
                let value = this.gameBoard.movePiece(move.piece,move.tileFrom,move.tileTo,move.isPlayerBlack);
            }
        }


        //state machine
        switch(this.state){
            case "MENU":
                this.drawMenu();
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

    drawMenu(){
        console.log("Menu");
        this.state = "NEXT_TURN";
    }

    drawPossibleMoves(pickedPiece){
        console.log("Possible Moves");
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
        this.gameBoard.display();
        this.auxBoardBlack.display();
        this.auxBoardWhite.display();
        
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
                console.log("Select a valid tile to move the piece");
            }
            else{
                // verify if the piece equals turn player
                if(this.isPayerBlack && obj.type == "black" || !this.isPayerBlack && obj.type == "white"){
                    this.pickedPiece = obj;
                    this.state = "POSSIBLE_MOVES";
                }

            }
        }
        else if (obj instanceof MyTile) {
            // do something with the tile  
            if(this.pickedPiece != null){
                this.pickedTile = obj;
                if(this.gameBoard.isValidMove(this.pickedPiece, this.pickedPiece.getTile(), this.pickedTile, this.isPayerBlack)){
                    // console.log("INITIAL X,Y");
                    // console.log(this.pickedPiece.getTile().x);
                    // console.log(this.pickedPiece.getTile().y);
                    // they stay the same
                    this.gameSequence.addMove(new MyGameMove(this.scene, this.pickedPiece, this.pickedPiece.getTile(), this.pickedTile, this.gameBoard,this.isPayerBlack));
                    // change player
                    if(this.isPayerBlack){
                        this.isPayerBlack = false;
                    }
                    else{
                        this.isPayerBlack = true;
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
        else {
            console.log("Error: Picked object is not a piece or a tile");
        }
    }
}