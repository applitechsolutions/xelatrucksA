import { Destination } from './destination.model';

export class Order {

    constructor(
        public _destination: Destination,
        public date: string,
        public order: string,
        public _id?: string
    ) { }
}
