"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinionTechCard = exports.Minion = exports.MinionKeyword = void 0;
var MinionKeyword;
(function (MinionKeyword) {
    MinionKeyword[MinionKeyword["LUMBERING"] = 0] = "LUMBERING";
    MinionKeyword[MinionKeyword["FLURRY"] = 1] = "FLURRY";
    MinionKeyword[MinionKeyword["FLYING"] = 2] = "FLYING";
    MinionKeyword[MinionKeyword["SPAWNING"] = 3] = "SPAWNING";
    MinionKeyword[MinionKeyword["PERSISTENT"] = 4] = "PERSISTENT";
    MinionKeyword[MinionKeyword["UNSUMMON_ATK"] = 5] = "UNSUMMON_ATK";
    MinionKeyword[MinionKeyword["DEADLY_ATK"] = 6] = "DEADLY_ATK";
    MinionKeyword[MinionKeyword["WARD"] = 7] = "WARD";
    MinionKeyword[MinionKeyword["BLINK"] = 8] = "BLINK";
    MinionKeyword[MinionKeyword["CRT_WHIRLWIND"] = 9] = "CRT_WHIRLWIND";
    MinionKeyword[MinionKeyword["CRT_EARTHQUAKE"] = 10] = "CRT_EARTHQUAKE";
    MinionKeyword[MinionKeyword["CRT_FIRESTORM"] = 11] = "CRT_FIRESTORM";
    MinionKeyword[MinionKeyword["CRT_FLOOD"] = 12] = "CRT_FLOOD";
    MinionKeyword[MinionKeyword["IS_NECROMANCER"] = 13] = "IS_NECROMANCER";
    MinionKeyword[MinionKeyword["UNDEATHTOUCHABLE"] = 14] = "UNDEATHTOUCHABLE";
    MinionKeyword[MinionKeyword["GENERATE_MANA_3"] = 15] = "GENERATE_MANA_3";
    MinionKeyword[MinionKeyword["GENERATE_MANA_2"] = 16] = "GENERATE_MANA_2";
})(MinionKeyword || (exports.MinionKeyword = MinionKeyword = {}));
var Minion = /** @class */ (function () {
    function Minion(minionType, team) {
        this.spd = minionType.spd;
        this.range = minionType.range;
        this.atk = minionType.atk;
        this.def = minionType.def;
        this.id = Math.random();
        this.keywords = minionType.keywords.slice();
        this.hasMoved = true;
        this.hasAttacked = true;
        this.isExhausted = true;
        this.team = team;
        this.type = minionType;
    }
    Minion.prototype.reset = function () {
        this.atk = this.type.atk;
        this.def = this.type.def;
        this.spd = this.type.spd;
        this.range = this.type.range;
        this.hasMoved = false;
        this.hasAttacked = false;
        this.isExhausted = false;
    };
    return Minion;
}());
exports.Minion = Minion;
var MinionTechCard = /** @class */ (function () {
    function MinionTechCard(spd, range, atk, def, cost, rebait, keywords, rawLineNumber) {
        this.isNecromancer = false;
        this.spd = spd;
        this.range = range;
        this.atk = atk;
        this.def = def;
        this.keywords = keywords;
        this.cost = cost;
        this.rebait = rebait;
        this.rawLineNumber = rawLineNumber;
        if (MinionKeyword.GENERATE_MANA_2 in keywords || MinionKeyword.GENERATE_MANA_3 in keywords)
            this.isNecromancer = true;
    }
    return MinionTechCard;
}());
exports.MinionTechCard = MinionTechCard;
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
