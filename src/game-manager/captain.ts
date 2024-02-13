import { Minion } from "./minion";

export class Captain {
    public numMinions: number;
    public readonly activeMinions: Array<Minion>;
    public readonly reinforcements: Array<Minion>;
    public readonly casualties: Array<Minion>

    constructor () {
        this.numMinions = 0;
        this.activeMinions = [];
        this.reinforcements = [];
        this.casualties = [];
    }
}