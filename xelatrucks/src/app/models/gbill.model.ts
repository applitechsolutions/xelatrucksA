import { CPCustomer } from './CPcustomer.model';
import { DetailBill } from './gdetail.model';

export class GreenBill {

    constructor(
        public _customer: CPCustomer,
        public noBill: string,
        public serie: string,
        public date: Date,
        public total: number,
        public state: boolean = false,
        public paid: boolean = false,
        public oc?: string,
        public ac?: string,
        public details?: DetailBill[],
        public _id?: string,
    ) {}
}
