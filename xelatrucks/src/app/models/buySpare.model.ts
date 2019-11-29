import { AutoProvider } from './autoProvider.model';
import { DetailsSpare } from './detailsSpare.model';
import { Storage } from './storage';

export class BuySpare {

    constructor(
        public _provider: AutoProvider,
        public date: string,
        public discount: number,
        public total: number,
        public state: boolean = false,
        public noBill?: string,
        public serie?: string,
        public noDoc?: string,
        public details?: DetailsSpare[],
        public _id?: string,
    ) { }
}
