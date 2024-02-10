import { Minion } from "./minion";

export class Captain {
    public numMinions: number;
    public readonly minions: Array<Minion>;

    constructor () {
        this.numMinions = 0;
        this.minions = [];
    }
}