export class User {

    constructor(
        public name: string,
        public email: string,
        public password: string,
        public lastName?: string,
        public role: string = 'USER_ROLE',
        public state: boolean = false,
        public img?: string,
        public _id?: string
    ) {}

}
