import cloneDeep from 'lodash.clonedeep';

export enum MinionKeyword {
    LUMBERING, FLURRY, FLYING, SPAWNING, PERSISTENT, UNSUMMON_ATK, DEADLY_ATK, WARD, BLINK, CRT_WHIRLWIND, CRT_EARTHQUAKE, CRT_FIRESTORM, CRT_FLOOD, UNDEATHTOUCHABLE, GENERATE_MANA_3, GENERATE_MANA_2
}

export type UnitName = "NECROMANCER" | "ZOMBIE" | "ACOLYTE" | "INITIATE" | "SKELETON"; //, SERPENT, WARG, GHOST, WIGHT, HAUNT

export class Minion {
    public spd: number;
    public range: number;
    public atk: number;
    public def: number;
    public readonly keywords: Set<MinionKeyword>;

    public canMove: boolean;
    public canAttack: boolean;
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

        this.keywords = cloneDeep(minionType.keywords);

        this.canMove = false;
        this.canAttack = false;
        this.isExhausted = false;

        this.team = team;

        this.type = minionType;
    }

    public reset(){
        this.atk = this.type.atk;
        this.def = this.type.def;
        this.spd = this.type.spd;
        this.range = this.type.range;

        this.canMove = true;
        this.canAttack = true;
        this.isExhausted = false;
    }

    public print(){
        console.log(this.type.name);
    }
}

export class MinionTechCard {
    public spd: number;
    public range: number;
    public atk: number;
    public def: number;
    public readonly keywords: Set<MinionKeyword>;

    public cost: number;
    public rebait: number;

    public name: string;

    public rawLineNumber: number;
    public isNecromancer: boolean = false;

    public constructor(name: string, spd: number, range: number, atk: number, def: number, cost: number, rebait: number, rawLineNumber: number, keywords: Set<MinionKeyword>) {
        this.spd = spd;
        this.range = range;
        this.atk = atk;
        this.def = def;
        this.keywords = keywords;
        this.cost = cost;
        this.rebait = rebait;
        this.rawLineNumber = rawLineNumber;
        this.name = name;

        if(keywords.has(MinionKeyword.GENERATE_MANA_2) || keywords.has(MinionKeyword.GENERATE_MANA_3))
            this.isNecromancer = true;
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