export enum MinionKeywords {
    LUMBERING, FLURRY, FLYING, SPAWNING, PERSISTENT, UNSUMMON_ATK, DEADLY_ATK, WARD, BLINK, CRT_WHIRLWIND, CRT_EARTHQUAKE, CRT_FIRESTORM, CRT_FLOOD
}

export class Minion {
    public spd: number;
    public range: number;
    public atk: number;
    public def: number;
    public readonly keywords: Array<MinionKeywords>;

    public team: number;

    public hasMoved: boolean;
    public hasAttacked: boolean;
    public isExhausted: boolean;

    public constructor(minionType : MinionType, team: number) {
        this.spd = minionType.spd;
        this.range = minionType.range;
        this.atk = minionType.atk;
        this.def = minionType.def;
        this.keywords = minionType.keywords.slice();
        this.team = team;
        this.hasMoved = true; // minion can't move or attack the turn it spawns
        this.hasAttacked = true;
        this.isExhausted = true;
    }
}

export class MinionType {
    public spd: number;
    public range: number;
    public atk: number;
    public def: number;
    public readonly keywords: Array<MinionKeywords>;

    public cost: number;
    public rebait: number;

    public constructor(spd: number, range: number, atk: number, def: number, cost: number, rebait: number, keywords: Array<MinionKeywords>) {
        this.spd = spd;
        this.range = range;
        this.atk = atk;
        this.def = def;
        this.keywords = keywords;
        this.cost = cost;
        this.rebait = rebait;
    }
}

// class MinionFactory {
//     public config: Map<string, Map<string, string>>;

//     public constructor(config: Map<string, Map<string, string>>) {
//         this.config = config;
//     }

//     public createMinion(type: string, team:number):Minion {
//         assert(type in this.config);
//         let stats: Map<string, string> | undefined = this.config.get(type);
//         return new Minion(stats["spd"], stats["range"], stats["atk"], stats["def"], stats["keywords"]);
//     }

// }