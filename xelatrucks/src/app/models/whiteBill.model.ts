import { CPCustomer } from './CPcustomer.model';
import { DetailWbill } from './wdetail.model';

export class WhiteBill {

    constructor(
        public _customer: CPCustomer,
        public bill: string,
        public serie: string,
        public date: Date,
        public total: number,
        public state: boolean = false,
        public paid: boolean = false,
        public oc?: string,
        public ac?: string,
        public details?: DetailWbill[],
        public _id?: string,
    ) {}
}
