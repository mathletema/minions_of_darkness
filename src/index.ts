import * as fs from 'fs';

import { GameManager } from "./game-manager/game-manager";
import { Coordinate } from "./util";
import { UnitName, MinionTechCard, MinionKeyword } from './game-manager/minion';

const __HELP__ =
    "help               : display this prompt    \n" +
    "print              : print current board map\n" +
    "quit               : quit program           \n" +
    "move B x1 y1 x2 y2 : move piece from (x1, y1) -> (x2, y2) on board B \n" +
    "pass               : pass the turn" +
    "buy B U            : buy unit #U";
const __PROMPT__ = "_> "

interface gameConfig {
    boardSize: number;
    boardMap: Array<Array<Array<string>>>;
    startNodes: Array<Array<Coordinate>>;
    minionStats: Map<string, Map<string, string>>;
}

// TODO: hardcoded MinionData, will Fix
let minionData: Record <UnitName, MinionTechCard> = 
{   
    NECROMANCER: new MinionTechCard("Necromancer", 1, 1, 0, 7, 0, 0, 0, new Set([MinionKeyword.UNSUMMON_ATK, MinionKeyword.PERSISTENT, MinionKeyword.UNDEATHTOUCHABLE, MinionKeyword.GENERATE_MANA_3])),
    ZOMBIE: new MinionTechCard("Zombie", 1, 1, 1, 1, 2, 0, 0, new Set([MinionKeyword.LUMBERING])),
    ACOLYTE: new MinionTechCard("Acolyte", 2, 0, 0, 2, 4, 2, 0, new Set()),
    INITIATE: new MinionTechCard("Initiate", 2, 1, 2, 3, 3, 1, 1, new Set([MinionKeyword.LUMBERING, MinionKeyword.SPAWNING, MinionKeyword.CRT_FLOOD, MinionKeyword.PERSISTENT])),
    SKELETON: new MinionTechCard("Skeleton", 1, 1, 5, 2, 3, 1, 2, new Set([MinionKeyword.FLYING])),
};

let data = fs.readFileSync('./game-configs/single_board_test.json', 'utf8');
let config:gameConfig = JSON.parse(data);
console.log(config.startNodes[0][0])

const NUM_BOARDS = 2;

const mana = Math.floor(5.5 * NUM_BOARDS);

const game = new GameManager(NUM_BOARDS, config["boardSize"], minionData, mana);
// game.initMinionData(minionData)
game.initBoardMaps(config.boardMap);
game.initStartPositions(config.startNodes);

game.print()
process.stdout.write(__PROMPT__)

process.stdin.on("data", (buffer) => {
    // handle input
    let data = buffer.toString().trim().split(' ')
    if (data[0] === "quit") process.exit();
    else if (data[0] === "help") process.stdout.write(__HELP__);
    else if (data[0] === "print") game.print();
    else if (data[0] === "move") {
        try {
            const boardIndex: number = parseInt(data[1]);
            const start: Coordinate = {x: parseInt(data[2]), y: parseInt(data[3])};
            const end: Coordinate = {x: parseInt(data[4]), y: parseInt(data[5])};
            game.doMove(boardIndex, start, end);
        } catch {
            process.stdout.write(`invalid move command`)
        }
    }
    else if (data[0] === "pass") game.endTurn();
    else if (data[0] === "buy") {
        try {
            const boardIndex: number = parseInt(data[1]);
            const unitName: UnitName = data[2] as UnitName;
            game.buyMinion(boardIndex, unitName); 
        } catch {
            process.stdout.write(`invalid buy command`)
        } 
    }
    else {
        process.stdout.write(`command ${data[0]} not found, see help for more\n`)
    }
    process.stdout.write(__PROMPT__)
})