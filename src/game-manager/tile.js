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
    function Tile() {
        this.isWater = false;
        this.isGraveyard = false;
        this.isInherentlySpecial = false;
        this.hasMinion = false;
        this.tileType = TileKeyword.DEFAULT;
        this.currentMinion = null;
    }
    Tile.prototype.repr = function () {
        // let WaterRep = this.isWater ? " W " : "   ", "***"
        var tileRep = "   ";
        switch (this.tileType) {
            case TileKeyword.FLOOD: tileRep = " O ";
            case TileKeyword.EARTHQUAKE: tileRep = " E ";
            case TileKeyword.FIRESTORM: tileRep = " F ";
            case TileKeyword.WHIRLWIND: tileRep = " W ";
        }
        if (this.isGraveyard)
            tileRep = " G ";
        if (this.isWater)
            tileRep = " W ";
        var UnitRep = "***";
        if (this.currentMinion !== null) {
            UnitRep = "*" + this.currentMinion.def + "*";
        }
        return [tileRep, UnitRep];
    };
    return Tile;
}());
exports.Tile = Tile;
