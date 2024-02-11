import { Minion } from "./minion";
// import { Coordinate } from "../util";

export enum TileKeywords {
    DEFAULT, FLOOD, EARTHQUAKE, FIRESTORM, WHIRLWIND
}

export class Tile {
    public isWater: boolean;
    public hasMinion: boolean;
    public currentMinion: Minion | null;
    public tileType: TileKeywords;

    // public readonly neighbouringTiles: Array<Tile>;
    
    public constructor (isWater: boolean) {
        this.hasMinion = false;
        this.tileType = TileKeywords.DEFAULT;
        this.currentMinion = null;
        this.isWater = isWater;
    }

    public repr (): Array<string> {
        return [this.isWater ? " W " : "   ", "***"]
    }
}