import { Order } from './order.model';
import { Material } from './material.model';

export class Pull {

    constructor(
        public _order: Order,
        public _material: Material,
        public mts: number,
        public totalMts: number,
        public kg: number,
        public totalKg: number,
        public _id?: string
    ) { }
}
