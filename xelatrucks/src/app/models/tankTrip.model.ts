import { Vehicle } from './vehicle.model';
import { Employee } from './employee.model';
import { DestTank } from './destTank.model';

export class TankTrip {

    constructor(
        public _employee: Employee,
        public _vehicle: Vehicle,
        public _destination: DestTank,
        public date?: Date,
        public checkIN?: Date,
        public checkOUT?: Date,
        public trips?: number,
        public tariff?: number,
        public _id?: string,
        public state?: boolean
    ) {}
}