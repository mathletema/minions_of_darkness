import { Tile } from "./tile"

export class Board {
    public boardSize: number;
    public readonly board: Array<Array<Tile>>;
    // public startCoord;

    constructor(boardSize: number) {
        this.boardSize = boardSize;
        this.board = [];
        // this.startCoord = 
    }

    public setWater(isWater: Array<Array<boolean>>): void {
        for (let i = 0; i < this.boardSize; i++) {
            this.board.push([]);
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i].push(new Tile(isWater[i][j]));
            }
        }
    }
}