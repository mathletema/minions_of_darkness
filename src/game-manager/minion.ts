export enum MinionKeywords {
    LUMBERING, FLURRY, FLYING, SPAWN, PERSISTENT, UNSUMMON_ATK, DEADLY_ATK, WARD, BLINK, CRT_WHIRLWIND, CRT_EARTHQUAKE, CRT_FIRESTORM, CRT_FLOOD
}

export class Minion {
    public spd: number;
    public range: number;
    public atk: number;
    public def: number;
    public readonly keywords: Array<MinionKeywords>;

    public hasMoved: boolean;
    public hasAttacked: boolean;

    public constructor(spd: number, range: number, atk: number, def: number, keywords: Array<MinionKeywords>) {
        this.spd = spd;
        this.range = range;
        this.atk = atk;
        this.def = def;
        this.keywords = keywords;
        this.hasMoved = true; // minion can't move or attack the turn it spawns
        this.hasAttacked = true;
    }
}