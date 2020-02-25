import { DetailTTbill } from './ttdetail.model';
import { DestTank } from './destTank.model';

export class DetailTbill {
    constructor(
        public _destination: DestTank,
        public mts: number,
        public noTrips: number,
        public details: DetailTTbill[],
        public _id?: string
    ) { }
}