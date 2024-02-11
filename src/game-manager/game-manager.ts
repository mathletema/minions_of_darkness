import { Board } from './board';
import { Coordinate } from '../util';
import { Minion } from './minion';
import { General } from './general';

enum MoveType { MOVE, ATTACK };

export class GameManager {
    public numBoards: number;
    public general: Array<General>
    public currentTeam: number;
    public readonly board: Array<Board>;
    public boardSize: number;

    public constructor (numBoards: number, boardSize: number) {
        this.numBoards = numBoards;
        this.boardSize = boardSize;
        
        this.general = [
            new General(),
            new General()
        ];

        this.board = [];
        for (let i = 0; i < numBoards; i++) {
            this.board[i] = new Board(boardSize);
        }

        this.currentTeam = 0;
    }

    public initBoards(boardMap: Array<Array<Array<string>>>) {
        for (let i = 0; i < this.numBoards; i++) {
            this.board[i].init(boardMap[i]);
        }
    }

    public initStartNodes(startNodes: Array<Array<Coordinate>>) {
        for (let i = 0; i < this.numBoards; i++) {
            this.board[i].initStartNodes(startNodes[i]);
        }
    }

    public doMove(boardIndex: number, start: Coordinate, end: Coordinate) {
        this.board[boardIndex].doMove(this.currentTeam, start, end);
    }

    public doAttack(boardIndex: number) {
        this.board[boardIndex].doAttack(this.currentTeam);
    }

    public doSpawn(boardIndex: number, position: Coordinate, minion: Minion) {
        this.board[boardIndex].doSpawn(this.currentTeam, position, minion);
    }

    public print() {
        for (let i = 0; i < this.numBoards; i++) {
            console.log(`\n\nBoard ${i+1}....`)
            this.board[i].print();
            console.log("\n\n");
        }
    }
}