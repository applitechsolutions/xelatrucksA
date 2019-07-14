import { Basics } from './basics.model';
import { Pits } from './pits.model';

export class Gondola {

    constructor(
        public plate: string,
        public state: boolean,
        public truck?: string,
        public basics?: Basics[],
        public pits?: Pits[],
        public _id?: string
    ) {}
}