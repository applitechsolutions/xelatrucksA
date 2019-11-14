import { Tariff } from './tariff.model';

export class Type {

    constructor(
        public code: string,
        public name: string,
        public km: number,
        public tariff: Tariff[],
        public _id?: string
    ) {}

}
