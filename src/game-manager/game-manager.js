"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
var board_1 = require("./board");
var general_1 = require("./general");
var MoveType;
(function (MoveType) {
    MoveType[MoveType["MOVE"] = 0] = "MOVE";
    MoveType[MoveType["ATTACK"] = 1] = "ATTACK";
    MoveType[MoveType["SPAWN"] = 2] = "SPAWN";
})(MoveType || (MoveType = {}));
;
var GameManager = /** @class */ (function () {
    function GameManager(numBoards, boardSize, minionData) {
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
        this.minionTypesData = minionData;
    }
    GameManager.prototype.initBoards = function (boardMap) {
        for (var i = 0; i < this.numBoards; i++) {
            this.board[i].init(boardMap[i]);
            // this.board[i].initMinionTypesData(this.minionTypesData);
        }
    };
    GameManager.prototype.initStartPositions = function (startNodes) {
        for (var i = 0; i < this.numBoards; i++) {
            this.board[i].initStartPosition(startNodes[i]);
        }
    };
    GameManager.prototype.endTurn = function () {
        for (var i = 0; i < this.numBoards; i++) {
            this.board[i].endTurn();
        }
        this.currentTeam = 1 - this.currentTeam;
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
