import { Vehicle } from './vehicle.model';
import { Employee } from './employee.model';
import { Pull } from './pull.model';

export class WhiteTrip {

    constructor(
        public _employee: Employee,
        public _vehicle: Vehicle,
        public _pull: Pull,
        public date: Date,
        public noTicket: string,
        public mts: number,
        public kgB: number,
        public kgT: number,
        public kgN: number,
        public checkIN: Date,
        public checkOUT: Date,
        public tariff: number,
        public invoiced: boolean,
        public noDelivery?: string,
        public _id?: string
    ) { }
}