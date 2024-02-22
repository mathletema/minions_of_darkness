import { Minion } from "./minion";
// import { Coordinate } from "../util";

export enum TileKeyword {
    DEFAULT, FLOOD, EARTHQUAKE, FIRESTORM, WHIRLWIND
}

export class Tile {
    public isWater: boolean = false;
    public hasMinion: boolean;
    public currentMinion: Minion | null;
    public tileType: TileKeyword;
    public isGraveyard: boolean = false;
    public isInherentlySpecial: boolean = false;

    public constructor () {
        this.hasMinion = false;
        this.tileType = TileKeyword.DEFAULT;
        this.currentMinion = null;
    }

    public repr (): Array<string> {
        // let WaterRep = this.isWater ? " W " : "   ", "***"
        let tileRep: string = "   "
        switch(this.tileType){
            case TileKeyword.FLOOD: tileRep = " O ";
            case TileKeyword.EARTHQUAKE: tileRep = " E "; 
            case TileKeyword.FIRESTORM: tileRep = " F ";
            case TileKeyword.WHIRLWIND: tileRep = " H ";
        }
        if (this.isGraveyard) tileRep = " G ";
        if (this.isWater) tileRep = " W "

        let UnitRep: string = "***";
        if(this.currentMinion !==  null){
            UnitRep = "*" + this.currentMinion.def + "*";
        }
        return [tileRep, UnitRep];
    }
}