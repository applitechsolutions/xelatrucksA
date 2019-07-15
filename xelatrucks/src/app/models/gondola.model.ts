import { Basics } from './basics.model';
import { Pits } from './pits.model';
import { Vehicle } from './vehicle.model';

export class Gondola {

    constructor(
        public plate: string,
        public _truck?: Vehicle,
        public basics?: Basics[],
        public pits?: Pits[],
        public state?: boolean,
        public _id?: string
    ) {}
}