import { User } from "./user.model";
import { Material } from "./material.model";
import { StorageMaterial } from './storageMaterial.model';

export class MissingSurplus {
    constructor(
        public type: boolean,
        public load: number,
        public _user: User,
        public _material: Material,
        public description: string,
        public _materialCellar: StorageMaterial,
        public state: string,
        public _id?: string
    ) { }
}