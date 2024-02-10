import { Captain } from './captain';
import { General } from './general';

export class Team {
    public numCaptains: number;
    public general: General;
    public readonly captains: Array<Captain>;

    public constructor (numCaptains: number) {
        this.numCaptains = numCaptains;
        this.general = new General();
        this.captains = [];
        for (let i = 0; i < this.numCaptains; i++) {
            this.captains.push(new Captain());
        }
    }
}