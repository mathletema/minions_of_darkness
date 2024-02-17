import * as fs from 'fs';

import { GameManager } from "./game-manager/game-manager";
import { Coordinate } from "./util";
import { UnitName, MinionType, MinionKeyword } from './game-manager/minion';

const __HELP__ =
    "help               : display this prompt    \n" +
    "print              : print current board map\n" +
    "quit               : quit program           \n" +
    "move B x1 y1 x2 y2 : move piece from (x1, y1) -> (x2, y2) on board B \n" +
    "pass               : pass the turn";
const __PROMPT__ = "_> "

interface gameConfig {
    boardSize: number;
    boardMap: Array<Array<Array<string>>>;
    startNodes: Array<Array<Coordinate>>;
    minionStats: Map<string, Map<string, string>>;
}

// TODO: hardcoded MinionData, will Fix
let minionData: Record <UnitName, MinionType> = 
{   
    NECROMANCER: new MinionType(1, 1, 0, 7, 0, 0, [MinionKeyword.UNSUMMON_ATK, MinionKeyword.PERSISTENT, MinionKeyword.IS_NECROMANCER, MinionKeyword.UNDEATHTOUCHABLE, MinionKeyword.GENERATE_MANA_3], 0),
    ZOMBIE: new MinionType(1, 1, 1, 1, 2, 0, [MinionKeyword.LUMBERING], 0)
}

let data = fs.readFileSync('./game-configs/test.json', 'utf8');
let config:gameConfig = JSON.parse(data);
console.log(config.startNodes[0][0])

const NUM_BOARDS = 2;

const game = new GameManager(NUM_BOARDS, config["boardSize"], minionData);
// game.initMinionData(minionData)
game.initBoards(config.boardMap);
game.initStartPositions(config.startNodes);

game.print()
process.stdout.write(__PROMPT__)

process.stdin.on("data", (buffer) => {
    // handle input
    let data = buffer.toString().trim().split(' ')
    if (data[0] == "quit") process.exit();
    else if (data[0] == "help") process.stdout.write(__HELP__);
    else if (data[0] == "print") game.print();
    else if (data[0] == "move") {
        try {
            let boardIndex: number = parseInt(data[1]);
            let start: Coordinate = {x: parseInt(data[2]), y: parseInt(data[3])};
            let end: Coordinate = {x: parseInt(data[4]), y: parseInt(data[5])};
            game.doMove(boardIndex, start, end);
        } catch {
            process.stdout.write(`invalid move command`)
        }
    }
    else {
        process.stdout.write(`command ${data[0]} not found, see help for more\n`)
    }
    process.stdout.write(__PROMPT__)
})