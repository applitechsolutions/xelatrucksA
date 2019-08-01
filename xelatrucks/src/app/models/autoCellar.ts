export class AutoCellar {

    constructor(
        public name: string,
        public id?: string,
        public storage?: Storage[]
    ) {}

}

export interface Storage {
    stock: number;
    cost: number;
    _id?: string;
}
