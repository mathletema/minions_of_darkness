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

    public print(): void {
        let W = 7 * this.boardSize + 4;
        let H = 6 * this.boardSize;
        let buffer:Array<Array<string>> = [];
        for (let i = 0; i < H; i++) {
            buffer.push([]);
            for (let j = 0; j < W; j++) {
                buffer[i].push('.');
            }
        }

        let pattern = [
            "   _ _   ",
            " /     \\ ",
            "/       \\",
            "\\       /",
            " \\ _ _ / ",
        ];

        let px = 3;
        let py = 2;

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                let cx:number = 4 + 7*i;
                let cy:number = 2 + 4*j + 2*i;
                cx = W - 3 - cx;
                
                for (let rx = 0; rx < 9; rx++) {
                    for (let ry = 0; ry < 5; ry++) {
                        buffer[cy-py+ry][cx-px+rx] = pattern[ry][rx];
                    }
                }

                for (let ix = 0; ix < 3; ix++) {
                    for (let iy = 0; iy < 2; iy++) {
                        buffer[cy + iy][cx + ix] = '*';
                    }
                }

                /**
                 * Replace this part with board[tile].repr
                */

                buffer[cy][cx+1] = i.toString();
                buffer[cy + 1][cx+1] = j.toString();
            }
        }

        process.stdout.write('_'.repeat(W+2) + '\n');
        for (let i = 0; i < H; i++) {
            process.stdout.write('|')
            for (let j = 0; j < W; j++) {
                process.stdout.write(buffer[i][j]);
            }
            process.stdout.write('|')
            process.stdout.write('\n');
        }
        process.stdout.write('|' + '_'.repeat(W) + '|' + '\n');   
    }
}