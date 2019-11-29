import { Vehicle } from './vehicle.model';
import { Employee } from './employee.model';

export class WhiteTrip {

    constructor(
        public _employee: Employee,
        public _vehicle: Vehicle,
        public date?: Date,
        public checkIN?: Date,
        public checkOUT?: Date,
        public trips?: number,
        public details?: string,
        public _id?: string,
        public state?: boolean
    ) {}
}