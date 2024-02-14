"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = exports.TileKeyword = void 0;
// import { Coordinate } from "../util";
var TileKeyword;
(function (TileKeyword) {
    TileKeyword[TileKeyword["DEFAULT"] = 0] = "DEFAULT";
    TileKeyword[TileKeyword["FLOOD"] = 1] = "FLOOD";
    TileKeyword[TileKeyword["EARTHQUAKE"] = 2] = "EARTHQUAKE";
    TileKeyword[TileKeyword["FIRESTORM"] = 3] = "FIRESTORM";
    TileKeyword[TileKeyword["WHIRLWIND"] = 4] = "WHIRLWIND";
})(TileKeyword || (exports.TileKeyword = TileKeyword = {}));
var Tile = /** @class */ (function () {
    // public readonly neighbouringTiles: Array<Tile>;
    function Tile(isWater) {
        this.hasMinion = false;
        this.tileType = TileKeyword.DEFAULT;
        this.currentMinion = null;
        this.isWater = isWater;
    }
    Tile.prototype.repr = function () {
        // let WaterRep = this.isWater ? " W " : "   ", "***"
        var UnitRep = "***";
        if (this.currentMinion !== null) {
            UnitRep = "*" + this.currentMinion.def + "*";
        }
        return [this.isWater ? " W " : "   ", UnitRep];
    };
    return Tile;
}());
exports.Tile = Tile;
