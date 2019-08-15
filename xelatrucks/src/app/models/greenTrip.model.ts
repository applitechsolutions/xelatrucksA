import { Vehicle } from './vehicle.model';
import { Employee } from './employee.model';
import { Material } from './material.model';
import { Type } from './type.model';

export class GreenTrip {

    constructor(
        public _employee: Employee,
        public _type: Type,
        public _vehicle: Vehicle,
        public _material: Material,
        public date?: Date,
        public checkIN?: Date,
        public checkOUT?: Date,
        public trips?: number,
        public details?: string,
        public _id?: string,
        public state?: boolean
    ) {}
}