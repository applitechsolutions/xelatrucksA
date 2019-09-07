import { DetailsSpare } from './detailsSpare.model';

export class BuySpare {

    constructor(
        public _customer: string,
        public date: string,
        public total: number,
        public state: boolean = false,
        public noBill?: string,
        public serie?: string,
        public noDoc?: string,
        public details?: DetailsSpare[],
        public _id?: string,
    ) {}
}
