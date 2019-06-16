import { Decimal } from './decimal.model';
import { AutoProvider } from './autoProvider.model';
import { DetailsSpare } from './detailsSpare.model';

export class BuySpare {

    constructor(
        public _provider: AutoProvider,
        public date: Date,
        public total: Decimal,
        public state: boolean = false,
        public noBill?: string,
        public serie?: string,
        public noDoc?: string,
        public details?: DetailsSpare[],
        public _id?: string
    ) {}
}