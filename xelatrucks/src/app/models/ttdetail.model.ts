
export class DetailTTbill {
    constructor(
        public date: Date,
        public noTicket: string,
        public noDelivery: string,
        public employee: string,
        public destination: string,
        public km: number,
        public _id?: string
    ) { }
}
