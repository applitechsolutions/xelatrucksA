import { Material } from './material.model';

export class StorageMaterial {

    constructor(
        public _material: Material,
        public stock: number,
        public cost: number,
    ) {}

}
