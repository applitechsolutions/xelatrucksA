import { GreenTrip } from './greenTrip.model';
import { Tariff } from './tariff.model';
export class PreDetailBill {
    constructor(
        public code: string,
        public prod: string,
        public totalmts: number,
        public trips: number,
        public tariff?: Tariff[],
        public _id?: string
    ) {}
}
