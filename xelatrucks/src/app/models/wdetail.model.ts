import { Material } from './material.model';
import { DetailWTbill } from './wtdetail.model';

export class DetailWbill {
    constructor(
        public _material: Material,
        public nameMat: string,
        public details: DetailWTbill[],
        public totalM: number,
        public totalQ: number,
        public noTrips: number,
        public _id?: string
    ) { }
}