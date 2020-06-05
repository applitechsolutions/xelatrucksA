import { Order } from './order.model';
import { WhiteTrip } from './whiteTrip.model';
export class PurchaseCD {

    constructor(
        public date: string,
        public noBill: string,
        public serie: string,
        public sap: string,
        public _order: Order,
        public details: Details[],
        public total: number,
        public payment: boolean = false,
        public paid: boolean = true,
        public _id?: string
    ) { }

}

export interface Details {
    _id?: string;
    _whiteTrip: WhiteTrip;
    cost: number;
}
