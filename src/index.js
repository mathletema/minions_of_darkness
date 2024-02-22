"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var game_manager_1 = require("./game-manager/game-manager");
var minion_1 = require("./game-manager/minion");
var __HELP__ = "help               : display this prompt    \n" +
    "print              : print current board map\n" +
    "quit               : quit program           \n" +
    "move B x1 y1 x2 y2 : move piece from (x1, y1) -> (x2, y2) on board B \n" +
    "pass               : pass the turn";
var __PROMPT__ = "_> ";
// TODO: hardcoded MinionData, will Fix
var minionData = {
    NECROMANCER: new minion_1.MinionTechCard(1, 1, 0, 7, 0, 0, [minion_1.MinionKeyword.UNSUMMON_ATK, minion_1.MinionKeyword.PERSISTENT, minion_1.MinionKeyword.IS_NECROMANCER, minion_1.MinionKeyword.UNDEATHTOUCHABLE, minion_1.MinionKeyword.GENERATE_MANA_3], 0),
    ZOMBIE: new minion_1.MinionTechCard(1, 1, 1, 1, 2, 0, [minion_1.MinionKeyword.LUMBERING], 0),
    ACOLYTE: new minion_1.MinionTechCard(2, 0, 0, 2, 4, 2, [], 0)
};
var data = fs.readFileSync('./game-configs/test.json', 'utf8');
var config = JSON.parse(data);
console.log(config.startNodes[0][0]);
var NUM_BOARDS = 2;
var mana = Math.floor(5.5 * NUM_BOARDS);
var game = new game_manager_1.GameManager(NUM_BOARDS, config["boardSize"], minionData, mana);
// game.initMinionData(minionData)
game.initBoardMaps(config.boardMap);
game.initStartPositions(config.startNodes);
game.print();
process.stdout.write(__PROMPT__);
process.stdin.on("data", function (buffer) {
    // handle input
    var data = buffer.toString().trim().split(' ');
    if (data[0] == "quit")
        process.exit();
    else if (data[0] == "help")
        process.stdout.write(__HELP__);
    else if (data[0] == "print")
        game.print();
    else if (data[0] == "move") {
        try {
            var boardIndex = parseInt(data[1]);
            var start = { x: parseInt(data[2]), y: parseInt(data[3]) };
            var end = { x: parseInt(data[4]), y: parseInt(data[5]) };
            game.doMove(boardIndex, start, end);
        }
        catch (_a) {
            process.stdout.write("invalid move command");
        }
    }
    else {
        process.stdout.write("command ".concat(data[0], " not found, see help for more\n"));
    }
    process.stdout.write(__PROMPT__);
});
