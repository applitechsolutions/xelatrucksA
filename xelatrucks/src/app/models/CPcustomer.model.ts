
export class CPCustomer {

    constructor(
        public name: string,
        public state: boolean = false,
        public nit?: string,
        public address?: string,
        public mobile?: string,
        public _id?: string
    ) {}
}