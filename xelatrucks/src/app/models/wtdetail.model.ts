
export class DetailWTbill {
    constructor(
        public date: Date,
        public noTicket: string,
        public noDelivery: string,
        public employee: string,
        public destination: string,
        public km: number,
        public mts: number,
        public kgB: number,
        public kgT: number,
        public kgN: number,
        public _id?: string
    ) {}
}