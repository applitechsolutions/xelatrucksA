import { Tariff } from './tariff.model';

export class Destination {

    constructor(
        public name: string,
        public type: string,
        public km: number,
        public tariff: Tariff[],
        public _id?: string
    ) { }

}
