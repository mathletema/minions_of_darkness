export enum MinionKeyword {
    LUMBERING, FLURRY, FLYING, SPAWNING, PERSISTENT, UNSUMMON_ATK, DEADLY_ATK, WARD, BLINK, CRT_WHIRLWIND, CRT_EARTHQUAKE, CRT_FIRESTORM, CRT_FLOOD, IS_NECROMANCER, UNDEATHTOUCHABLE, GENERATE_MANA_3, GENERATE_MANA_2
}

export type UnitName = "NECROMANCER" | "ZOMBIE" // ACOLYTE, INITIATE, SKELETON, SERPENT, WARG, GHOST, WIGHT, HAUNT

export class Minion {
    public spd: number;
    public range: number;
    public atk: number;
    public def: number;
    public readonly keywords: Array<MinionKeyword>;

    public hasMoved: boolean;
    public hasAttacked: boolean;
    public isExhausted: boolean;

    public team;
    public type;

    public id: number;

    public constructor(minionType : MinionTechCard, team: number) {
        this.spd = minionType.spd;
        this.range = minionType.range;
        this.atk = minionType.atk;
        this.def = minionType.def;

        this.id = Math.random()

        this.keywords = minionType.keywords.slice();

        this.hasMoved = true;
        this.hasAttacked = true;
        this.isExhausted = true;

        this.team = team;

        this.type = minionType;
    }

    public reset(){
        this.atk = this.type.atk;
        this.def = this.type.def;
        this.spd = this.type.spd;
        this.range = this.type.range;

        this.hasMoved = false;
        this.hasAttacked = false;
        this.isExhausted = false;
    }
}

export class MinionTechCard {
    public spd: number;
    public range: number;
    public atk: number;
    public def: number;
    public readonly keywords: Array<MinionKeyword>;

    public cost: number;
    public rebait: number;

    public rawLineNumber: number;

    public constructor(spd: number, range: number, atk: number, def: number, cost: number, rebait: number, keywords: Array<MinionKeyword>, rawLineNumber: number) {
        this.spd = spd;
        this.range = range;
        this.atk = atk;
        this.def = def;
        this.keywords = keywords;
        this.cost = cost;
        this.rebait = rebait;
        this.rawLineNumber = rawLineNumber;
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