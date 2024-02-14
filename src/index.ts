import * as fs from 'fs';

import { GameManager } from "./game-manager/game-manager";
import { Coordinate } from "./util";
import { UnitName, MinionType, MinionKeyword } from './game-manager/minion';

const __HELP__ =
    "help  : displays this prompt    \n"
    "print : prints current board map\n"
    "quit  : quits program           \n"
    "move bd_num x1 y1 x2 y2: moves piece from (x1, y1) -> (x2, y2) on board bd_num \n"
    "pass  : passes the turn"
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
    let data = buffer.toString().trim();
    if (data == "quit") process.exit();
    if (data == "help") process.stdout.write(__HELP__);
    if (data == "print") game.print();
    if (data.slice(0, 4) == "move") {
        let fragmentedData: Array<string> = data.slice(4).split(' ');
        let boardIndex = parseInt(fragmentedData[0]);
        let start: Coordinate = {x: parseInt(fragmentedData[1]), y: parseInt(fragmentedData[2])};
        let target: Coordinate = {x: parseInt(fragmentedData[3]), y: parseInt(fragmentedData[4])};

        game.doMove(boardIndex, start, target);
    }
    if (data == "pass") game.endTurn();
    process.stdout.write(__PROMPT__)
})