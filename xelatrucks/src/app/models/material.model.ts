export class Material {

    constructor(
        public code: string,
        public name: string,
        public minStock: number,
        public cost?: number,
        public price?: number,
        public isCD?: boolean,
        public _id?: string
    ) { }

}