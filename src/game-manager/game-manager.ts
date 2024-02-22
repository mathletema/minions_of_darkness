import { Board } from './board';
import { Coordinate } from '../util';
import { MinionTechCard, Minion, UnitName, MinionKeyword } from './minion';
import { General } from './general';

enum MoveType { MOVE, ATTACK, SPAWN };

export class GameManager {
    public numBoards: number;
    public general: Array<General>
    public currentTeam: number;
    public readonly board: Array<Board>;
    public boardSize: number;
    public minionData: Record<UnitName, MinionTechCard>;
    public mana: Array<number>;
    public playNumber: number = 1;
    public boardPoints: Array<number> = [0, 0];
    
    public constructor (numBoards: number, boardSize: number, minionData: Record<UnitName, MinionTechCard>, startingMana: number) {
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

        this.minionData = minionData;

        this.mana = [0, startingMana];
    }

    public initBoardMaps(boardMap: Array<Array<Array<string>>>) {
        for (let i = 0; i < this.numBoards; i++) {
            this.board[i].initMap(boardMap[i]);
            // this.board[i].initMinionTypesData(this.minionTypesData);
        }
    }

    public initStartPositions(startNodes: Array<Array<Coordinate>>) {
        for (let i = 0; i < this.numBoards; i++) {
            this.board[i].initStartPosition(startNodes[i]);
        }
    }

    public endTurn() {
        let graveyardMana = 0, casualtyMana = 0;
        for(let i = 0; i < this.numBoards; i++){
            const winner = this.board[i].findWinner(this.currentTeam);
            graveyardMana += this.board[i].findGraveyardMana(this.currentTeam);
            casualtyMana += this.board[i].findCasualtyMana(this.currentTeam);

            // Check how board loss works
            this.board[i].resetMinions(this.currentTeam);
        }

        this.mana[this.currentTeam] += graveyardMana;
        this.mana[1 - this.currentTeam] += casualtyMana;

        if(this.currentTeam === 1)
            this.playNumber++;
        
        this.currentTeam = 1 - this.currentTeam;

        if (this.playNumber === 2 || this.playNumber === 3){
            this.giftAcolytes(); // Gift acolytes on blue's first turn or yellow's second turn
        }
    }

    public giftAcolytes() {
        for(let i = 0; i < this.numBoards; i++){
            const minion = new Minion(this.minionData.ACOLYTE, this.currentTeam);
            this.board[i].createMinion(null, minion);
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
        console.log("Current team" + this.currentTeam + "\n\n");
        console.log("Meowna " + this.mana[0] + " " + this.mana[1]);
    }
}