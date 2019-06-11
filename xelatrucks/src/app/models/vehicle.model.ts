import { Basics } from './basics.model';
import { Pits } from './pits.model';
import { Make } from './make.model';

export class Vehicle {

    constructor(
        public cp: string,
        public type: string,
        public _make: string,
        public plate: string,
        public state: boolean = false,
        public no?: number,
        public model?: number,
        public km?: number,
        public mts?: number,
        public _gondola?: string,
        public basics?: Basics[],
        public pits?: Pits[],
        public _id?: string
    ) {}

}