import { Type } from './type.model';

export class DetailBill {
    constructor(
        public _type: Type,
        public mts: number,
        public trips: number,
        public cost: number,
        public _id?: string
    ) {}
}