import { Rim } from './rim.model';
import { Decimal } from './decimal.model';

export class Pits {

    constructor(
        public rim?: Rim,
        public km?: number,
        public counter?: number,
        public axis?: string,
        public place?: string,
        public side?: string,
        public date?: Date,
        public total?: number,
        public _id?: string
    ) {}

}