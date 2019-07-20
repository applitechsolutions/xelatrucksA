import { Basics } from './basics.model';
import { Pits } from './pits.model';
import { Make } from './make.model';
import { Gas } from './gas.model';
import { Gondola } from './gondola.model';

export class Vehicle {

    constructor(
        public type: string,
        public _make: Make,
        public plate: string,
        public state: boolean = false,
        public cp?: string,
        public no?: number,
        public model?: number,
        public km?: number,
        public mts?: number,
        public _gondola?: Gondola,
        public _id?: string,
        public basics?: Basics[],
        public pits?: Pits[],
        public gasoline?: Gas[],
    ) {}
}