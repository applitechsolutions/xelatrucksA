import { User } from './user.model';
import { Vehicle } from './vehicle.model';
import { Gondola } from './gondola.model';
import { Mechanic } from './mech.model';
import { DetailsSpare } from './detailsSpare.model';

export class Maintenance {

    constructor(
        public _user: User,
        public _vehicle: Vehicle,
        public _gondola: Gondola,
        public dateStart?: Date,
        public dateEnd?: Date,
        public _mech?: Mechanic[],
        public detailsV?: DetailsSpare[],
        public detailsG?: DetailsSpare[],
        public totalV?: number,
        public totalG?: number,
        public detailsRev?: string,
        public detailsRep?: string,
        public typeMaintenance?: string,
        public state?: boolean,
        public _id?: string,
    ) {}
}