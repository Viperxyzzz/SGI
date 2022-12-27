import { MyTile } from "./MyTile.js";
import { MyPiece } from "./MyPiece.js";
import { MyGameBoard } from "./MyGameBoard.js";

export class MyGameMove {

    constructor(scene, piece = null, tileFrom = null, tileTo = null, board = null, isPlayerBlack = false){
        this.scene = scene;
        this.piece = piece;
        this.tileFrom = tileFrom;
        this.tileTo = tileTo;
        this.board = board;
        this.isPlayerBlack = isPlayerBlack;
    }

    animate() {
        this.piece.setTile(this.tileTo);
        this.tileFrom.unsetPiece();
        this.tileTo.setPiece(this.piece);
    }

}