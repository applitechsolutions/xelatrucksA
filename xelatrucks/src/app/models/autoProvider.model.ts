
export class AutoProvider {

    constructor(
        public name: string,
        public state: boolean = false,
        public address?: string,
        public mobile1?: string,
        public mobile2?: string,
        public email?: string,
        public account1?: string,
        public account2?: string,
        public details?: string,
        public _id?: string
    ) {}
}