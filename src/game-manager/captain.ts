import { Minion } from "./minion";

export class Captain {
    public numMinions: number;
    public readonly minions: Array<Minion>;
    // public readonly reinforcements: Array<Minion>;
    // public readonly casualties: Array<Minion>

    constructor () {
        this.numMinions = 0;
        this.minions = [];
    }
}