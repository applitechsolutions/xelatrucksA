import { Customer } from "./customer.model";
import { DetailSale } from "./detailSale.model";

export class Sale {
    constructor(
        public _customer: Customer,
        public date: Date,
        public state: boolean,
        public total: number,
        public serie?: string,
        public bill?: string,
        public details?: DetailSale[],
        public _id?: string
    ) { }
}