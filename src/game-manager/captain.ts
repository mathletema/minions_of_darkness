import { Minion } from "./minion";

export class Captain {
    public numMinions: number;
    public readonly activeMinions: Set<Minion>;
    public readonly reinforcements: Set<Minion>;
    public readonly casualties: Set<Minion>

    constructor () {
        this.numMinions = 0;
        this.activeMinions = new Set();
        this.reinforcements = new Set();
        this.casualties = new Set();
    }
}