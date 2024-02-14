import { Minion } from "./minion";
// import { Coordinate } from "../util";

export enum TileKeyword {
    DEFAULT, FLOOD, EARTHQUAKE, FIRESTORM, WHIRLWIND, GRAVEYARD
}

export class Tile {
    public isWater: boolean;
    public hasMinion: boolean;
    public currentMinion: Minion | null;
    public tileType: TileKeyword;
    public isGraveyard: boolean = false;

    public constructor (isWater: boolean) {
        this.hasMinion = false;
        this.tileType = TileKeyword.DEFAULT;
        this.currentMinion = null;
        this.isWater = isWater;
    }

    public repr (): Array<string> {
        // let WaterRep = this.isWater ? " W " : "   ", "***"
        let UnitRep: string = "***";
        if(this.currentMinion !==  null){
            UnitRep = "*" + this.currentMinion.def + "*";
        }
        return [this.isWater ? " W " : "   ", UnitRep]
    }
}