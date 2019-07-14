import { Basics } from './basics.model';
import { Pits } from './pits.model';

export class Gondola {

    constructor(
        public plate: string,
        public _truck?: string,
        public basics?: Basics[],
        public pits?: Pits[],
        public state?: boolean,
        public _id?: string
    ) {}
}