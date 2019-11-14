
export class Tariff {
    constructor(
        public start: number,
        public end: number,
        public cost: number,
        public index?: number,
        public _id?: string
    ) {}
}
