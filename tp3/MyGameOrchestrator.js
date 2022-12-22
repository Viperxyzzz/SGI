import { MySceneGraph } from "./MySceneGraph.js";
import { MyGameSequence } from "./MyGameSequence.js";
import { MyAnimator } from "./MyAnimator.js";
import { MyGameBoard } from "./MyGameBoard.js";
import { MyPiece } from "./MyPiece.js";
import { MyTile } from "./MyTile.js";
import { MyGameMove } from "./MyGameMove.js";

export class MyGameOrchestrator {
    constructor(scene) {
        this.gameSequence = new MyGameSequence(scene);
        this.gameBoard = new MyGameBoard(scene);
        //this.theme = new MySceneGraph("scenes/tp3/board.xml", scene);
        //this.animator = new MyAnimator(scene, this, this.gameSequence);
        this.pickedPiece = null;
        this.pickedTile = null;
        this.state = "MENU";
        this.isPayerBlack = true;
    }

    update(t) {
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
        this.state = "NEXT_TURN";
    }

    display() {
        //this.theme.display();
        this.gameBoard.display();
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
                if(this.gameBoard.movePiece(this.pickedPiece, this.pickedPiece.getTile(), this.pickedTile, this.isPayerBlack)){
                    // change player
                    if(this.isPayerBlack){
                        this.isPayerBlack = false;
                    }
                    else{
                        this.isPayerBlack = true;
                    }
                    this.gameSequence.addMove(new MyGameMove(this.scene, this.pickedPiece, this.pickedPiece.getTile(), this.pickedTile, this.gameBoard));
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