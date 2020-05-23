import { Material } from "./material.model";

export class DetailSale {
    constructor(
        public material: Material,
        public total: number,
        public price: number,
        public _id?: string,
    ) { }
}