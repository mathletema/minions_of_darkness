import * as fs from 'fs';

import { GameManager } from "./game-manager/game-manager";
import { Coordinate } from "./util";
import { UnitName, MinionType, MinionKeyword } from './game-manager/minion';

const __HELP__ =
    "help  : displays this prompt    \n"
    "print : prints current board map\n"
    "quit  : quits program           \n";
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
    NECROMANCER: new MinionType(1, 1, 0, 7, 0, 0, [MinionKeyword.UNSUMMON_ATK, MinionKeyword.PERSISTENT], 0),
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
    let data = buffer.toString().trim()
    if (data == "quit") process.exit()
    if (data == "help") process.stdout.write(__HELP__)
    if (data == "print") game.print()
    process.stdout.write(__PROMPT__)
})