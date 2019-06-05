import { Area } from './area.model';
export class UserArea {

    constructor(
        public _area: Area[],
        public _user: string,
        public _id?: string
    ) {}

}