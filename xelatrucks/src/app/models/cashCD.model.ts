import { User } from './user.model';
import { CashTypeCD } from './cashTypeCD.model';
export class CashCD {

    constructor(
        public _cashTypeCD: CashTypeCD,
        public _user: User,
        public date: string,
        public amount: number,
        public balance: number,
        public details?: string,
        public _id?: string
    ) { }

}