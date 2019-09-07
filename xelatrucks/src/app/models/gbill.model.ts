import { CPCustomer } from './CPcustomer.model';
import { DetailBill } from './gdetail.model';

export class BuySpare {

    constructor(
        public _customer: CPCustomer,
        public noBill: string,
        public serie: string,
        public date: string,
        public total: number,
        public state: boolean = false,
        public oc?: string,
        public ac?: string,
        public noDoc?: string,
        public details?: DetailBill[],
        public _id?: string,
    ) {}
}
