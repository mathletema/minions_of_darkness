"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
var captain_1 = require("./captain");
var minion_1 = require("./minion");
var tile_1 = require("./tile");
var Board = /** @class */ (function () {
    function Board(boardSize, minionTypes) {
        this.boardSize = boardSize;
        this.board = [];
        for (var i = 0; i < boardSize; i++) {
            this.board.push([]);
            for (var j = 0; j < boardSize; j++) {
                this.board[i].push(new tile_1.Tile(false));
            }
        }
        this.captains = [
            new captain_1.Captain(),
            new captain_1.Captain(),
        ];
        this.minionTypes = minionTypes;
    }
    Board.prototype.init = function (boardMap) {
        for (var i = 0; i < this.boardSize; i++) {
            for (var j = 0; j < this.boardSize; j++) {
                this.board[i][j].isWater = (boardMap[i][j] == "W");
            }
        }
    };
    Board.prototype.initStartPosition = function (startPositions) {
        // Give each player the starting configuration of minions
        var minion;
        for (var team = 0; team < 2; team++) {
            minion = new minion_1.Minion(this.minionTypes.NECROMANCER, team);
            this.createMinion(startPositions[team], minion);
            for (var _i = 0, _a = this.adjacentPositionsForMinion(startPositions[team], null); _i < _a.length; _i++) {
                var neighbour = _a[_i];
                minion = new minion_1.Minion(this.minionTypes.ZOMBIE, team);
                this.createMinion(neighbour, minion);
            }
        }
    };
    Board.prototype.createMinion = function (position, minion) {
        var team = minion.team;
        if (position !== null) {
            this.captains[team].activeMinions.push(minion);
            this.board[position.x][position.y].currentMinion = minion;
        }
        else {
            this.captains[team].reinforcements.push(minion);
        }
    };
    Board.prototype.isOnBoard = function (coordinate) {
        if (coordinate.x >= this.boardSize || coordinate.x < 0)
            return false;
        if (coordinate.y >= this.boardSize || coordinate.y < 0)
            return false;
        return true;
    };
    Board.prototype.isLegalPlacement = function (coordinate, minion) {
        if (!this.isOnBoard(coordinate))
            return false;
        if (minion === null)
            return true;
        var tile = this.board[coordinate.x][coordinate.y];
        if (tile.isWater)
            return minion_1.MinionKeyword.FLYING in minion.keywords;
        var legality = true;
        if (tile.currentMinion != null) {
            if (tile.currentMinion.team != minion.team) {
                legality = (minion_1.MinionKeyword.FLYING in minion.keywords);
            }
        }
        switch (tile.tileType) {
            case tile_1.TileKeyword.DEFAULT: legality = true;
            case tile_1.TileKeyword.FLOOD: legality = (minion_1.MinionKeyword.FLYING in minion.keywords);
            case tile_1.TileKeyword.EARTHQUAKE: legality = (minion.spd >= 2);
            case tile_1.TileKeyword.FIRESTORM: legality = (minion.def >= 4);
            case tile_1.TileKeyword.WHIRLWIND: legality = (minion_1.MinionKeyword.PERSISTENT in minion.keywords);
        }
        return legality;
    };
    Board.prototype.adjacentPositionsForMinion = function (position, minion) {
        var adjacentPositions = new Array();
        var potentialPositions = [
            { x: position.x, y: position.y + 1 },
            { x: position.x + 1, y: position.y },
            { x: position.x, y: position.y - 1 },
            { x: position.x - 1, y: position.y },
            { x: position.x + 1, y: position.y - 1 },
            { x: position.x - 1, y: position.y + 1 }
        ];
        for (var _i = 0, potentialPositions_1 = potentialPositions; _i < potentialPositions_1.length; _i++) {
            var potentialPosition = potentialPositions_1[_i];
            if (this.isLegalPlacement(potentialPosition, minion)) {
                adjacentPositions.push(potentialPosition);
            }
        }
        return adjacentPositions;
    };
    Board.prototype.isReachable = function (start, target, minion) {
        var visited = new Set();
        var queue = [];
        visited.add(start);
        queue.push({ position: start, depth: 0 });
        var analyzedPositions = 0;
        while (queue.length > analyzedPositions) {
            var _a = queue[analyzedPositions], position = _a.position, depth = _a.depth;
            if (position === target)
                return true;
            if (depth >= minion.spd)
                continue;
            for (var _i = 0, _b = this.adjacentPositionsForMinion(position, minion); _i < _b.length; _i++) {
                var neighbour = _b[_i];
                if (!visited.has(neighbour)) {
                    visited.add(neighbour);
                    queue.push({ position: neighbour, depth: depth + 1 });
                }
            }
        }
        return false;
    };
    Board.prototype.doMove = function (team, start, target) {
        // assert(this.board[start.x][start.y].currentMinion != null)
        // assert(this.board[start.x][start.y].currentMinion in this.captain[team].minions)
        // legality check, that start and end have distance less than
        var actingMinion = this.board[start.x][start.y].currentMinion;
        if (actingMinion === null) {
            throw new Error("Tile is empty! No minion to move!");
        }
        else {
            if (!this.isReachable(start, target, actingMinion)) {
                throw new Error("Minion can not move so fast!");
            }
            if (this.board[target.x][target.y].currentMinion !== null) {
                throw new Error("Minion can not move on top of other minion");
                // TODO Minion should be able to move over friendly minion that can move,
                // as long as that minion is forced to move as part of next micro move
                // Minor detail.
            }
            // Minion was able to reach there!
            this.board[start.x][start.y].currentMinion = null;
            this.board[target.x][target.y].currentMinion = actingMinion;
        }
    };
    Board.prototype.doAttack = function (team, start, target) {
    };
    Board.prototype.doSpawn = function (team, position, minion) {
    };
    Board.prototype.print = function () {
        var W = 7 * this.boardSize + 4;
        var H = 6 * this.boardSize;
        var buffer = Array.from({ length: H }, function () { return Array(W).fill('.'); });
        var pattern = [
            "   _ _   ",
            " /     \\ ",
            "/       \\",
            "\\       /",
            " \\ _ _ / ",
        ];
        var px = 3;
        var py = 2;
        for (var i = 0; i < this.boardSize; i++) {
            for (var j = 0; j < this.boardSize; j++) {
                var cx = W - 7 - 7 * i;
                var cy = 2 + 4 * j + 2 * i;
                for (var rx = 0; rx < 9; rx++) {
                    for (var ry = 0; ry < 5; ry++) {
                        buffer[cy - py + ry][cx - px + rx] = pattern[ry][rx];
                    }
                }
                for (var ix = 0; ix < 3; ix++) {
                    for (var iy = 0; iy < 2; iy++) {
                        buffer[cy + iy][cx + ix] = '*';
                    }
                }
                var repr = this.board[i][j].repr();
                for (var r = 0; r < 3; r++)
                    buffer[cy][cx + r] = repr[0][r];
                for (var r = 0; r < 3; r++)
                    buffer[cy + 1][cx + r] = repr[1][r];
            }
        }
        process.stdout.write('_'.repeat(W + 2) + '\n');
        for (var i = 0; i < H; i++) {
            process.stdout.write('|');
            for (var j = 0; j < W; j++) {
                process.stdout.write(buffer[i][j]);
            }
            process.stdout.write('|\n');
        }
        process.stdout.write('|' + '_'.repeat(W) + '|' + '\n');
    };
    return Board;
}());
exports.Board = Board;
