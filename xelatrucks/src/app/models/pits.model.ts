import { Rim } from './rim.model';
import { Vehicle } from './vehicle.model';

export class Pits {

    constructor(
        public rim?: Rim,
        public km?: number,
        public counter?: number,
        public axis?: string,
        public place?: string,
        public side?: string,
        public date?: string,
        public total?: number,
        public _id?: string,
        public vehicle?: Vehicle
    ) {}

}
