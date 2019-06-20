import { Decimal } from './decimal.model';
import { Part } from './part.model';

export class DetailsSpare {

    constructor(
        public _part: Part,
        public quantity: number,
        public cost: number,
        public _id?: string
    ) {}
}