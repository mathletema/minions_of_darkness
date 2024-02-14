import { Board } from './board';
import { Coordinate } from '../util';
import { MinionType, Minion, UnitName, MinionKeyword } from './minion';
import { General } from './general';

enum MoveType { MOVE, ATTACK, SPAWN };

export class GameManager {
    public numBoards: number;
    public general: Array<General>
    public currentTeam: number;
    public readonly board: Array<Board>;
    public boardSize: number;
    public minionTypesData: Record<UnitName, MinionType>;

    public constructor (numBoards: number, boardSize: number, minionData: Record<UnitName, MinionType>) {
        this.numBoards = numBoards;
        this.boardSize = boardSize;
        
        this.general = [
            new General(),
            new General()
        ];

        this.board = [];
        for (let i = 0; i < numBoards; i++) {
            this.board[i] = new Board(boardSize, minionData);
        }

        this.currentTeam = 0;

        this.minionTypesData = minionData;
    }

    public initBoards(boardMap: Array<Array<Array<string>>>) {
        for (let i = 0; i < this.numBoards; i++) {
            this.board[i].init(boardMap[i]);
            // this.board[i].initMinionTypesData(this.minionTypesData);
        }
    }

    public initStartPositions(startNodes: Array<Array<Coordinate>>) {
        for (let i = 0; i < this.numBoards; i++) {
            this.board[i].initStartPosition(startNodes[i]);
        }
    }

    public doMove(boardIndex: number, start: Coordinate, target: Coordinate): void {
        this.board[boardIndex].doMove(this.currentTeam, start, target);
    }

    public doAttack(boardIndex: number, start: Coordinate, target: Coordinate): void {
        this.board[boardIndex].doAttack(this.currentTeam, start, target);
    }

    public doSpawn(boardIndex: number, position: Coordinate, minion: Minion): void {
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