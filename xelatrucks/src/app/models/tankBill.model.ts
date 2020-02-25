import { CPCustomer } from './CPcustomer.model';
import { DetailTbill } from './tdetail.model';

export class TankBill {

    constructor(
        public _customer: CPCustomer,
        public bill: string,
        public serie: string,
        public date: Date,
        public total: number,
        public state: boolean = false,
        public status: string,
        public oc?: string,
        public ac?: string,
        public details?: DetailTbill[],
        public _id?: string,
    ) {}
}
