import { CGFscene } from '../lib/CGF.js';
import { MyTile } from "./MyTile.js";
import { MyPiece } from "./MyPiece.js";


export class MyGameBoard {
    constructor(scene, auxBoardWhite, auxBoardBlack) {
        this.scene = scene;
        this.tiles = [];
        this.selectableTiles = [];
        this.selectablePieces = [];
        this.selectedPiece = null;
        this.selectedTile = null;
        this.board = Array(8).fill().map(() => Array(8));
        this.setTilesToBoard();
        this.initBoard();
        this.auxBoardWhite = auxBoardWhite;
        this.auxBoardBlack = auxBoardBlack;
    }

    setTilesToBoard() {
        for (let i = 7; i >= 0; i--) {
            for (let j = 7; j >= 0; j--) {
                this.board[i][j] = new MyTile(this.scene, i * 8 + j + 101, i, j);
                this.board[i][j].setBoard(this);
            }
        }
    }
    
    initBoard() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++){
                if(j < 3){
                    if(this.board[i][j].getMaterialApplied() == "black"){
                        this.addPiecetoTile(new MyPiece(this.scene, i * 8 + j + 1, "white"), this.board[i][j]);
                    }
                }
                else if(j > 4){
                    if(this.board[i][j].getMaterialApplied() == "black"){
                        this.addPiecetoTile(new MyPiece(this.scene, i * 8 + j + 1, "black"), this.board[i][j]);
                    }
                }
            }
        }
    }
    
    addPiecetoTile(piece, tile) {
        tile.setPiece(piece);
        piece.setTile(tile);
    }

    removePiecefromTile(piece, tile) {
        tile.unsetPiece();
        piece.unsetTile();
    }

    getPiece(tile){
        return tile.getPiece();
    }

    getTile(piece){
        return piece.getTile();
    }

    getTileByCoords(x, y) {
        return this.board[x][y];
    }

    movePiece(piece, startTile, endTile, playerBlack) {
        if(this.isValidMove(piece, startTile, endTile, playerBlack)){
            this.removePiecefromTile(piece, startTile);
            this.addPiecetoTile(piece, endTile);
            if(piece.type == "white" && endTile.y == 7){
                piece.isKing = true;
                console.log("white king");
            }
            else if(piece.type == "black" && endTile.y == 0){
                piece.isKing = true;
                console.log("black king");
            }
            if(this.isEating(piece, startTile, endTile, playerBlack)){
                this.eat(piece, startTile, endTile, playerBlack);
            }
            return true;
        }
        return false;
    }

    isEating(piece, startTile, endTile, playerBlack) {
        if(Math.abs(startTile.x - endTile.x) != 2){
            return false;
        }
        let jumpedX = (startTile.x + endTile.x) / 2;
        let jumpedY = (startTile.y + endTile.y) / 2;
        if(this.getTileByCoords(jumpedX, jumpedY).getPiece() == null || this.getTileByCoords(jumpedX, jumpedY).getPiece().type == piece.type){
            return false;
        }
        return true;
    }

    //should only by used inside a isEating() == true
    getEatedPiece(startTile, endTile){
        let jumpedX = (startTile.x + endTile.x) / 2;
        let jumpedY = (startTile.y + endTile.y) / 2;
        return this.getTileByCoords(jumpedX,jumpedY).getPiece();
    }

    
    eat(piece, startTile, endTile, playerBlack) {
        let jumpedX = (startTile.x + endTile.x) / 2;
        let jumpedY = (startTile.y + endTile.y) / 2;
        var piece = this.getTileByCoords(jumpedX, jumpedY).getPiece();
        this.removePiecefromTile(this.getTileByCoords(jumpedX, jumpedY).getPiece(), this.getTileByCoords(jumpedX, jumpedY));
        if(piece.type == "black"){
            console.log("adding to auxiliar board black ");
            this.auxBoardBlack.addPiece(piece);
        }
        else{
            console.log("adding to auxiliar board white ");
            this.auxBoardWhite.addPiece(piece);
        }
    }

    //check if a move is possible
    isValidMove(piece, startTile, endTile, playerBlack) {

        // Check that the end tile is not occupied
        if(endTile.getPiece() != null){
            return false;
        }

        // Check that the move is diagonal
        if(Math.abs(startTile.x - endTile.x) !== Math.abs(startTile.y - endTile.y)){
            return false;
        }


        // Check that the piece is moving in the correct direction (forward for regular pieces, any direction for kings)
        if(playerBlack && piece.type == "black"){
            if(endTile.y > startTile.y && !piece.isKing){
                return false;
            }
        }
        else{
            if(endTile.y < startTile.y && !piece.isKing){
                return false;
            }
        }

        if(!piece.isKing){
            if(Math.abs(startTile.x - endTile.x) == 2){
                return this.isEating(piece, startTile, endTile, playerBlack);
            }
        }
        else{
            let dx = endTile.x - startTile.x;
            let dy = endTile.y - startTile.y;

            let x = endTile.x - (dx / Math.abs(dx));
            let y = endTile.y - (dy / Math.abs(dy));

            if(x >= 0 && x < 8 && y >= 0 && y < 8){
                let tile = this.getTileByCoords(x, y);
                if(tile.getPiece() !== null){
                    if(tile.getPiece().type !== piece.type){
                        this.removePiecefromTile(tile.getPiece(), tile);
                    }
                    else{
                        return true;
                    }
                }
            }
        }
        return true;
    }


    display() {

        let m4 = mat4.create();
        m4 = mat4.translate(m4, m4, [0, 0, 8]);
        // m4 = mat4.scale(m4, m4, [0.5, 0.5, 0.5])
        m4 = mat4.rotate(m4, m4, -Math.PI / 2, [1, 0, 0]);
        this.scene.pushMatrix();
        
        this.scene.multMatrix(m4);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.board[i][j].display();
            }
        }
        this.scene.popMatrix();
    }
}