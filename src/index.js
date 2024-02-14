"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var game_manager_1 = require("./game-manager/game-manager");
var minion_1 = require("./game-manager/minion");
var __HELP__ = "help  : displays this prompt    \n";
"print : prints current board map\n";
"quit  : quits program           \n";
var __PROMPT__ = "_> ";
// TODO: hardcoded MinionData, will Fix
var minionData = {
    NECROMANCER: new minion_1.MinionType(1, 1, 0, 7, 0, 0, [minion_1.MinionKeyword.UNSUMMON_ATK, minion_1.MinionKeyword.PERSISTENT], 0),
    ZOMBIE: new minion_1.MinionType(1, 1, 1, 1, 2, 0, [minion_1.MinionKeyword.LUMBERING], 0)
};
var data = fs.readFileSync('./game-configs/test.json', 'utf8');
var config = JSON.parse(data);
console.log(config.startNodes[0][0]);
var NUM_BOARDS = 2;
var game = new game_manager_1.GameManager(NUM_BOARDS, config["boardSize"], minionData);
// game.initMinionData(minionData)
game.initBoards(config.boardMap);
game.initStartPositions(config.startNodes);
game.print();
process.stdout.write(__PROMPT__);
process.stdin.on("data", function (buffer) {
    // handle input
    var data = buffer.toString().trim();
    if (data == "quit")
        process.exit();
    if (data == "help")
        process.stdout.write(__HELP__);
    if (data == "print")
        game.print();
    process.stdout.write(__PROMPT__);
});
