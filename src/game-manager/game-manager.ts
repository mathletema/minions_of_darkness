import { Team } from './team';
import { Board } from './board';
import { Coordinate } from '../util';
import { Minion } from './minion';

enum MoveType { MOVE, ATTACK };

export class GameManager {
    public numCaptains: number;
    public teams: Array<Team>;
    public currentTeam: number;
    public readonly boards: Array<Board>;
    public boardSize: number;

    public constructor (numCaptains: number, boardSize: number) {
        this.numCaptains = numCaptains;
        this.boardSize = boardSize;
        this.teams = [
            new Team(numCaptains),
            new Team(numCaptains)
        ];
        this.currentTeam = 0;
        this.boards = [];
        for (let i = 0; i < numCaptains; i++) {
            this.boards[i] = new Board(boardSize);
        }
    }

    public initBoards() {
        // set water for each board etc
    }

    public doMove(captainIndex: number, start: Coordinate, end: Coordinate) {
    }

    public doAttack(captainIndex: number) {
    }

    public doSpawn(captainIndex: number, position: Coordinate, minion: Minion) {
    }

    public printState() {
    }
}