import { Coordinate } from "../util";
import { Captain } from "./captain";
import { Minion, MinionKeyword, MinionTechCard, UnitName } from "./minion";
import { Tile, TileKeyword } from "./tile"

export class Board {
    public boardSize: number;
    public readonly board: Array<Array<Tile>>;
    public readonly captains: Array<Captain>;
    public minionData: Record<UnitName, MinionTechCard>;
    public hasResigned: Array<boolean> = [false, false];

    constructor(boardSize: number, minionData: Record<UnitName, MinionTechCard>) {
        this.boardSize = boardSize;
        this.board = [];
        for (let i = 0; i < boardSize; i++) {
            this.board.push([]);
            for (let j = 0; j < boardSize; j++) {
                this.board[i].push(new Tile());
            }
        }
        this.captains = [
            new Captain(), 
            new Captain(),
        ];
        this.minionData = minionData;
    }

    public initMap(boardMap: Array<Array<string>>): void {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                switch(boardMap[i][j]){
                    case "W": this.board[i][j].isWater = true;
                    case "G": this.board[i][j].isGraveyard = true;
                    case "E": this.board[i][j].tileType = TileKeyword.EARTHQUAKE;
                    case "F": this.board[i][j].tileType = TileKeyword.FIRESTORM;
                    case "W": this.board[i][j].tileType = TileKeyword.WHIRLWIND;
                    case "O": this.board[i][j].tileType = TileKeyword.FLOOD;
                    case "L": this.board[i][j].isInherentlySpecial = false;
                }
            }
        }
    }

    public initStartPosition(startPositions: Array<Coordinate>) {
        // Give each player the starting configuration of minions
        let minion: Minion;
        for (let team = 0; team < 2; team++){
            minion = new Minion(this.minionData.NECROMANCER, team);
            this.createMinion(startPositions[team], minion);

            for (let neighbour of this.adjacentPositionsForMinion(startPositions[team], null)){
                minion = new Minion(this.minionData.ZOMBIE, team);
                this.createMinion(neighbour, minion);
            }
        }
    }

    public createMinion(position: Coordinate | null, minion: Minion) {
        let team = minion.team;
        if (position !== null){
            this.captains[team].activeMinions.push(minion);
            this.board[position.x][position.y].currentMinion = minion;
        }
        else {
            this.captains[team].reinforcements.push(minion);
        }
    }

    public resetMinions(currentTeam: number) {
        for (let team = 0; team < 2; team++){
            for (let minion of this.captains[team].activeMinions){
                minion.reset();
            }
        }
    }

    public findGraveyardMana(currentTeam: number): number{
        let graveyardMana = 0;
        for (let i = 0; i<this.boardSize; i++){
            for (let j = 0; j<this.boardSize; j++){
                const tile = this.board[i][j];
                const minion = tile.currentMinion;
                if(minion !== null){
                    if(minion.team === currentTeam){
                        if(tile.isGraveyard)
                            graveyardMana++;

                        if (MinionKeyword.GENERATE_MANA_2 in minion.keywords)
                            graveyardMana += 2;

                        if (MinionKeyword.GENERATE_MANA_3 in minion.keywords)
                            graveyardMana += 3;
                    }
                }
            }
        }

        return graveyardMana;
    }

    public findCasualtyMana(currentTeam: number): number{
        let casualtyMana = 0;

        for(const minion of this.captains[1 - currentTeam].casualties){
            casualtyMana += minion.type.rebait;
        }

        return casualtyMana;
    }

    public findWinner(currentTeam: number): number | null{
        // Check if board blows up
        if (this.hasResigned[currentTeam])
            return 1-currentTeam;

        // Check win on necromancers
        for(const minion of this.captains[1-currentTeam].casualties){
            if(minion.type.isNecromancer)
                return currentTeam;
        }

        // Check win on graveyards
        let opposingGraveyardCount = 0;
        for (let i = 0; i<this.boardSize; i++){
            for (let j = 0; j<this.boardSize; j++){
                const tile = this.board[i][j];
                const minion = tile.currentMinion;
                if(minion !== null){
                    if(minion.team === 1-currentTeam){
                        opposingGraveyardCount++
                    }
                }
            }
        }

        if(opposingGraveyardCount >= 8)
            return 1 - currentTeam;

        return null;
    }

    public endBoard(){
        // TODO Implement
    }

    public isOnBoard(coordinate: Coordinate): boolean{
        if (coordinate.x >= this.boardSize || coordinate.x < 0)
            return false;
        if (coordinate.y >= this.boardSize || coordinate.y < 0)
            return false;
        return true;
    }

    public isLegalPlacement(coordinate: Coordinate, minion: Minion | null): boolean{
        if(!this.isOnBoard(coordinate))
            return false;

        if (minion === null)
            return true;

        let tile = this.board[coordinate.x][coordinate.y];
        if(tile.isWater)
            return MinionKeyword.FLYING in minion.keywords;
        
        let legality: boolean = true;
        if(tile.currentMinion !== null){
            if(tile.currentMinion.team !== minion.team){
                legality = (MinionKeyword.FLYING in minion.keywords);
            }
        }

        switch(tile.tileType){
            case TileKeyword.FLOOD: legality = legality && (MinionKeyword.FLYING in minion.keywords);
            case TileKeyword.EARTHQUAKE: legality = legality && (minion.spd >= 2); 
            case TileKeyword.FIRESTORM: legality = legality && (minion.def >= 4);
            case TileKeyword.WHIRLWIND: legality = legality && (MinionKeyword.PERSISTENT in minion.keywords);
        }

        return legality;
    }

    public adjacentPositionsForMinion(position: Coordinate, minion: Minion | null): Array<Coordinate>{
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

        if(start.x === target.x && start.y === target.y)
            return true;

        let analyzedPositions = 0;
        while(queue.length > analyzedPositions){
            const { position, depth } = queue[analyzedPositions];
            if (depth >= minion.spd)
                break;

            console.log("Position During BFS: " + position.x + " " + position.y);
            for (const neighbour of this.adjacentPositionsForMinion(position, minion)){
                console.log(neighbour.x + " " + neighbour.y);
                if(!visited.has(neighbour)){
                    if(neighbour.x === target.x && neighbour.y === target.y)
                        return true;

                    visited.add(neighbour);
                    queue.push({ position: neighbour, depth: depth + 1 })
                }
            }

            analyzedPositions++;
        }
        return false;
    }

    public doMove(team: number, start: Coordinate, target: Coordinate) {
        let actingMinion: Minion | null = this.board[start.x][start.y].currentMinion;
        if (actingMinion === null){
           console.log("Tile is empty! No minion to move!");
           return;
        }

        if (actingMinion.team !== team){
            console.log("Ain't your minion");
            return;
        }

        if (!actingMinion.hasMoved){
            console.log("Minion has moved");
            return;
        }
        
        if (!this.isReachable(start, target, actingMinion)){
            console.log("Minion can not move there!");
            return;
        }

        if (this.board[target.x][target.y].currentMinion !== null){
            if(start.x !== target.x || start.y !== target.y){
                console.log("Minion can not move on top of other minion");
                return;
                // TODO Minion should be able to move over friendly minion that can move,
                // as long as that minion is forced to move as part of next micro move
                // Minor detail.
            }
        }

        console.log("Minion hath reach");

        // Minion was able to reach there!

        this.board[start.x][start.y].currentMinion = null;
        this.board[target.x][target.y].currentMinion = actingMinion;
        actingMinion.hasMoved = true;
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