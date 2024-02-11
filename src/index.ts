import { GameManager } from "./game-manager/game-manager";

const game = new GameManager(2, 4);
game.initBoards();

game.print()