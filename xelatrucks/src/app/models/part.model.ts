import { AutoCellar } from './autoCellar';

export class Part {

    constructor(
        public code: string,
        public desc: string,
        public minStock: number,
        public state: boolean,
        public id?: string,
        public cellar?: Cellar,
    ) {}

}

export interface Cellar {
    id?: string;
    autoCellar?: AutoCellar[];
}
