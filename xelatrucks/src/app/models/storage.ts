import { Part } from './part.model';

export class Storage {

    constructor(
        public _autopart: Part,
        public stock: number,
        public cost: number,
    ) {}

}
