"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
var board_1 = require("./board");
var minion_1 = require("./minion");
var general_1 = require("./general");
var MoveType;
(function (MoveType) {
    MoveType[MoveType["MOVE"] = 0] = "MOVE";
    MoveType[MoveType["ATTACK"] = 1] = "ATTACK";
    MoveType[MoveType["SPAWN"] = 2] = "SPAWN";
})(MoveType || (MoveType = {}));
;
var GameManager = /** @class */ (function () {
    function GameManager(numBoards, boardSize, minionData, mana) {
        this.playNumber = 1;
        this.boardPoints = [0, 0];
        this.numBoards = numBoards;
        this.boardSize = boardSize;
        this.general = [
            new general_1.General(),
            new general_1.General()
        ];
        this.board = [];
        for (var i = 0; i < numBoards; i++) {
            this.board[i] = new board_1.Board(boardSize, minionData);
        }
        this.currentTeam = 0;
        this.minionData = minionData;
        this.mana = [0, mana];
    }
    GameManager.prototype.initBoardMaps = function (boardMap) {
        for (var i = 0; i < this.numBoards; i++) {
            this.board[i].initMap(boardMap[i]);
            // this.board[i].initMinionTypesData(this.minionTypesData);
        }
    };
    GameManager.prototype.initStartPositions = function (startNodes) {
        for (var i = 0; i < this.numBoards; i++) {
            this.board[i].initStartPosition(startNodes[i]);
        }
    };
    GameManager.prototype.endTurn = function () {
        var graveyardMana = 0, casualtyMana = 0;
        for (var i = 0; i < this.numBoards; i++) {
            var winner = this.board[i].findWinner(this.currentTeam);
            graveyardMana += this.board[i].findGraveyardMana(this.currentTeam);
            casualtyMana += this.board[i].findCasualtyMana(this.currentTeam);
            // Check how board loss works
            this.board[i].resetMinions(this.currentTeam);
        }
        this.mana[this.currentTeam] += graveyardMana;
        this.mana[1 - this.currentTeam] += casualtyMana;
        if (this.currentTeam === 1)
            this.playNumber++;
        this.currentTeam = 1 - this.currentTeam;
        if (this.playNumber === 2 || this.playNumber === 3) {
            this.giftAcolytes(); // Gift acolytes on blue's first turn or yellow's second turn
        }
    };
    GameManager.prototype.giftAcolytes = function () {
        for (var i = 0; i < this.numBoards; i++) {
            var minion = new minion_1.Minion(this.minionData.ACOLYTE, this.currentTeam);
            this.board[i].createMinion(null, minion);
        }
    };
    GameManager.prototype.doMove = function (boardIndex, start, target) {
        this.board[boardIndex].doMove(this.currentTeam, start, target);
    };
    GameManager.prototype.doAttack = function (boardIndex, start, target) {
        this.board[boardIndex].doAttack(this.currentTeam, start, target);
    };
    GameManager.prototype.doSpawn = function (boardIndex, position, minion) {
        this.board[boardIndex].doSpawn(this.currentTeam, position, minion);
    };
    GameManager.prototype.print = function () {
        for (var i = 0; i < this.numBoards; i++) {
            console.log("\n\nBoard ".concat(i + 1, "...."));
            this.board[i].print();
            console.log("\n\n");
        }
        console.log("Current team" + this.currentTeam + "\n\n");
    };
    return GameManager;
}());
exports.GameManager = GameManager;
