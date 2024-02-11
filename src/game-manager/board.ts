import { Coordinate } from "../util";
import { Captain } from "./captain";
import { Minion } from "./minion";
import { Tile } from "./tile"

export class Board {
    public boardSize: number;
    public readonly board: Array<Array<Tile>>;
    public readonly captain: Array<Captain>;

    constructor(boardSize: number) {
        this.boardSize = boardSize;
        this.board = [];
        for (let i = 0; i < boardSize; i++) {
            this.board.push([])
            for (let j = 0; j < boardSize; j++) {
                this.board[i].push(new Tile(false))
            }
        }
        this.captain = [
            new Captain(), 
            new Captain(),
        ];
    }

    public setWater(isWater: Array<Array<boolean>>): void {
        for (let i = 0; i < this.boardSize; i++) {
            this.board.push([]);
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i].push(new Tile(isWater[i][j]));
            }
        }
    }

    public doMove(team: number, start: Coordinate, end: Coordinate) {
    }

    public doAttack(team: number) {
    }

    public doSpawn(team: number, position: Coordinate, minion: Minion) {
    }

    public print(): void {
        let W = 7 * this.boardSize + 4;
        let H = 6 * this.boardSize;

        let buffer:string[][] = Array.from({ length: H }, () => Array(W).fill('.'))

        let pattern = [
            "   _ _   ",
            " /     \\ ",
            "/       \\",
            "\\       /",
            " \\ _ _ / ",
        ];

        let px = 3; let py = 2;

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                let cx:number = W - 7 - 7*i;
                let cy:number = 2 + 4*j + 2*i;
                
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
            process.stdout.write('|\n')
        }
        process.stdout.write('|' + '_'.repeat(W) + '|' + '\n');   
    }
}