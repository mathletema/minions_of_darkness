import { Coordinate } from "../util";
import { Captain } from "./captain";
import { Minion, MinionKeywords } from "./minion";
import { Tile, TileKeywords } from "./tile"

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

    public init(boardMap: Array<Array<string>>): void {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i][j].isWater = (boardMap[i][j] == "W");
            }
        }
    }

    public initStartNodes(startNodes: Array<Coordinate>) {
        // pass
    }

    public isOnBoard(coordinate: Coordinate): boolean{
        if (coordinate.x >= this.boardSize || coordinate.x < 0)
            return false;
        if (coordinate.y >= this.boardSize || coordinate.y < 0)
            return false;
        return true;
    }

    public isLegalPlacement(coordinate: Coordinate, minion: Minion): boolean{
        if(!this.isOnBoard(coordinate))
            return false;
        let tile = this.board[coordinate.x][coordinate.y];
        if(tile.isWater)
            return MinionKeywords.FLYING in minion.keywords;
        
        let legality: boolean = true;
        if(tile.currentMinion != null){
            if(tile.currentMinion.team != minion.team){
                legality = (MinionKeywords.FLYING in minion.keywords);
            }
        }

        switch(tile.tileType){
            case TileKeywords.DEFAULT: legality = true;
            case TileKeywords.FLOOD: legality = (MinionKeywords.FLYING in minion.keywords);
            case TileKeywords.EARTHQUAKE: legality = (minion.spd >= 2); 
            case TileKeywords.FIRESTORM: legality = (minion.def >= 4);
            case TileKeywords.WHIRLWIND: legality = (MinionKeywords.PERSISTENT in minion.keywords);
        }

        return legality;
    }

    public adjacentPositionsForMinion(position: Coordinate, minion: Minion): Array<Coordinate>{
        let adjacentPositions: Array<Coordinate> = new Array();
        let potentialPositions: Array<Coordinate> = 
        [
            {x: position.x,   y: position.y+1},
            {x: position.x+1, y: position.y},
            {x: position.x,   y: position.y-1},
            {x: position.x-1, y: position.y},
            {x: position.x+1, y: position.y-1},
            {x: position.x-1, y: position.y+1}
        ]

        for(let potentialPosition of potentialPositions){
            if(this.isLegalPlacement(potentialPosition, minion)){
                adjacentPositions.push(potentialPosition)
            }
        }

        return adjacentPositions;
    }

    public isReachable(start: Coordinate, target: Coordinate, minion: Minion): boolean{
        const visited: Set<Coordinate> = new Set();
        const queue: {position: Coordinate, depth: number}[] = [];

        visited.add(start);
        queue.push({ position: start, depth: 0 });

        let analyzedPositions = 0;
        while(queue.length > analyzedPositions){
            const { position, depth } = queue[analyzedPositions];
            if (position === target)
                return true;
            if (depth >= minion.spd)
                continue;

            for (const neighbour of this.adjacentPositionsForMinion(position, minion)){
                if(!visited.has(neighbour)){
                    visited.add(neighbour);
                    queue.push({ position: neighbour, depth: depth + 1 })
                }
            }
        }
        return false;
    }

    public doMove(team: number, start: Coordinate, target: Coordinate) {
        // assert(this.board[start.x][start.y].currentMinion != null)
        // assert(this.board[start.x][start.y].currentMinion in this.captain[team].minions)
        // legality check, that start and end have distance less than
        let actingMinion: Minion | null = this.board[start.x][start.y].currentMinion;
        if (actingMinion === null){
            throw new Error("Tile is empty! No minion to move!");
        }
        else{
            if (!this.isReachable(start, target, actingMinion)){
                throw new Error("Minion can not move so fast!");
            }

            if (this.board[target.x][target.y].currentMinion !== null){
                throw new Error("Minion can not move on top of other minion");
                // TODO Minion should be able to move over friendly minion that can move,
                // as long as that minion is forced to move as part of next micro move
                // Minor detail.
            }

            // Minion was able to reach there!

            this.board[start.x][start.y].currentMinion = null;
            this.board[target.x][target.y].currentMinion = actingMinion;
        }
    }

    public doAttack(team: number, start: Coordinate, target: Coordinate) {
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
                
                let repr = this.board[i][j].repr();
                for (let r = 0; r < 3; r++) buffer[cy][cx+r] = repr[0][r];
                for (let r = 0; r < 3; r++) buffer[cy+1][cx+r] = repr[1][r];
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