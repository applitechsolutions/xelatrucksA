import { Type } from './type.model';
import { GreenTrip } from './greenTrip.model';

export class DetailBill {
    constructor(
        public date: string,
        public _type: Type,
        public details: any[],
        public mts: number,
        public trips: number,
        public cost: number,
        public _id?: string
    ) {}
}
