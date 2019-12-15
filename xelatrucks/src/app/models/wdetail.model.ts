import { Material } from './material.model';
import { DetailWTbill } from './wtdetail.model';

export class DetailWbill {
    constructor(
        public _material: Material,
        public details: DetailWTbill[],
        public totalM: number,
        public totalQ: number,
        public _id?: string
    ) {}
}