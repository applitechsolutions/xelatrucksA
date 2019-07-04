export class Mechanic {
    constructor(
        public code: string,
        public name: string,
        public state: boolean = false,
        public _id?: string
    ) {}
}
