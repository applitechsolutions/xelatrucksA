import { Basics } from './basics.model';
import { Pits } from './pits.model';
import { Make } from './make.model';
import { Decimal } from './decimal.model';

export class Vehicle {

    constructor(
        public type: string,
        public _make: Make,
        public plate: string,
        public state: boolean = false,
        public cp?: string,
        public no?: number,
        public model?: number,
        public km?: Decimal,
        public mts?: Decimal,
        public _gondola?: string,
        public basics?: Basics[],
        public pits?: Pits[],
        public _id?: string
    ) {}
}