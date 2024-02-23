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
    public isSpawnStage: boolean = false;

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
                    case "H": this.board[i][j].tileType = TileKeyword.WHIRLWIND;
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
            this.createMinion(minion, startPositions[team]);
            minion.reset();

            for (let neighbour of this.adjacentPositionsForMinion(startPositions[team])){
                minion = new Minion(this.minionData.ZOMBIE, team);
                this.createMinion(minion, neighbour);
                minion.reset();
            }
        }
    }

    public createMinion(minion: Minion, position: Coordinate | null = null) {
        let team = minion.team;
        if (position !== null){
            this.captains[team].activeMinions.add(minion);
            this.board[position.x][position.y].currentMinion = minion;
        }
        else {
            this.captains[team].reinforcements.add(minion);
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

                        if (minion.keywords.has(MinionKeyword.GENERATE_MANA_2))
                            graveyardMana += 2;

                        if (minion.keywords.has(MinionKeyword.GENERATE_MANA_3))
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

    public isLegalPlacement(coordinate: Coordinate, minion: Minion | null = null): boolean{
        if(!this.isOnBoard(coordinate))
            return false;

        if (minion === null)
            return true;

        let tile = this.board[coordinate.x][coordinate.y];
        if(tile.isWater)
            return minion.keywords.has(MinionKeyword.FLYING);
        
        let legality: boolean = true;
        if(tile.currentMinion !== null){
            if(tile.currentMinion.team !== minion.team){
                legality = minion.keywords.has(MinionKeyword.FLYING);
            }
        }

        switch(tile.tileType){
            case TileKeyword.FLOOD: legality = legality && minion.keywords.has(MinionKeyword.FLYING);
            case TileKeyword.EARTHQUAKE: legality = legality && (minion.spd >= 2); 
            case TileKeyword.FIRESTORM: legality = legality && (minion.def >= 4);
            case TileKeyword.WHIRLWIND: legality = legality && minion.keywords.has(MinionKeyword.PERSISTENT);
        }

        return legality;
    }

    public adjacentPositionsForMinion(position: Coordinate, minion: Minion | null = null): Array<Coordinate>{
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

    public absoluteDistance(start: Coordinate, target: Coordinate): number{
        const xDifference = (target.x - start.x), yDifference = (target.y - start.y);
        const zDifference = xDifference - yDifference;

        let differences = [Math.abs(xDifference), Math.abs(yDifference), Math.abs(zDifference)];
        differences = differences.sort((n1, n2) => n1 - n2);

        return differences[0] + differences[1];

    }

    public doMove(team: number, start: Coordinate, target: Coordinate) {
        if(this.isSpawnStage){
            console.log("You have reached spawning stage!");
            return;
        }
        if (!this.isOnBoard(start) || !this.isOnBoard(target)){
            console.log("Must be on board");
            return;
        }
        let actingMinion: Minion | null = this.board[start.x][start.y].currentMinion;
        if (actingMinion === null){
           console.log("Tile is empty! No minion to move!");
           return;
        }

        if (actingMinion.team !== team){
            console.log("Ain't your minion");
            return;
        }

        if (!actingMinion.canMove){
            console.log("Minion can't move no more");
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
        actingMinion.canMove = false;
    }

    public doAttack(team: number, start: Coordinate, target: Coordinate) {
        if(this.isSpawnStage){
            console.log("You have reached spawning stage!");
            return;
        }

        if (!this.isOnBoard(start) || !this.isOnBoard(target)){
            console.log("Must be on board");
            return;
        }
        let actingMinion: Minion | null = this.board[start.x][start.y].currentMinion;
        if (actingMinion === null){
           console.log("Tile is empty! No minion to attack with!");
           return;
        }

        if (actingMinion.team !== team){
            console.log("Ain't your minion");
            return;
        }

        let targetMinion: Minion | null = this.board[start.x][start.y].currentMinion;
        if (targetMinion === null){
            console.log("Tile is empty! No minion to attack!");
            return;
        }
 
        if (actingMinion.team === team){
            console.log("Self-attack :<>:");
            return;
        }

        if (this.absoluteDistance(start, target) >= actingMinion.range){
            console.log("Too far. Can't attack");
            return;
        }

        if (actingMinion.canAttack = false){
            console.log("This minion can't attack");
            return;
        }

        targetMinion.def -= actingMinion.atk; // TODO: Add keywords later
        if (!actingMinion.keywords.has(MinionKeyword.FLURRY))
            actingMinion.canAttack = false;
        actingMinion.canMove = false; 

        if(targetMinion.def <= 0){
            this.board[target.x][target.y].currentMinion = null;
            this.captains[1 - team].casualties.add(targetMinion);
        }   
    }

    public doSpawn(team: number, target: Coordinate, minion: Minion) {
        if (!this.isSpawnStage){
            console.log("Not spawn stage yet!");
            return;
        }

        if (!(this.captains[team].reinforcements.has(minion))){
            console.log("That minion isn't yours!");
            return;
        }

        if (minion.team != team){
            console.log("Ain't fair teams buddy");
            return;
        }

        if (!this.isOnBoard(target)){
            console.log("Poor chap will spawn 'n fall off the map");
            return;
        }

        if (!this.isLegalPlacement(target, minion)){
            console.log("Minion cannot stand on that hex");
            return;
        }

        if (this.board[target.x][target.y].currentMinion !== null){
            console.log("Is, A minion there!");
            return;
        }

        let isAdjacentSpawner = false;
        for(const adjacentPosition of this.adjacentPositionsForMinion(target)){
            const minion = this.board[adjacentPosition.x][adjacentPosition.y].currentMinion;
            if (minion !== null){
                if(minion.keywords.has(MinionKeyword.SPAWNING) && !minion.isExhausted)
                    isAdjacentSpawner = true;
            }
        }
        if (!isAdjacentSpawner){
            console.log("Who ya spawning off");
            return;
        }

        this.board[target.x][target.y].currentMinion = minion;
        this.captains[team].reinforcements.delete(minion);
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
        
        for(let team = 0; team < 2; team++){
            this.printTeamDetails(team);
        }
    }

    public printTeamDetails(team: number){
        console.log("REINFORCEMENTS: " + team);
        for (const minion of this.captains[team].reinforcements){
            minion.print();
        }

        console.log("\nCASUALTIES: " + team);
        for (const minion of this.captains[team].casualties){
            minion.print();
        }
    }
}