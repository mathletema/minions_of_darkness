import { Minion } from "./minion";

export enum TileKeywords {
    DEFAULT, FLOOD, EARTHQUAKE, FIRESTORM, WHIRLWIND
}

export class Tile {
    public isWater: boolean;
    public hasMinion: boolean;
    public currentMinion: Minion | null;
    public tileType: TileKeywords;
    
    public constructor (isWater: boolean) {
        this.hasMinion = false;
        this.tileType = TileKeywords.DEFAULT;
        this.currentMinion = null;
        this.isWater = isWater;
    }
}