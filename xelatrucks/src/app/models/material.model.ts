export class Material {

    constructor(
        public code: string,
        public name: string,
        public minStock: number,
        public price?: number,
        public _id?: string
    ) { }

}