

export class TaskModel {
    id: string;
    description: string;
    developer: string;
    title: string;
    state: string;
    dateLimit?: Date;
    dateCreate?: Date;

    constructor() {
        this.id = '';
        this.description = '';
        this.title = '';
        this.developer = '';
        this.state = 'Pendiente';
    }
}

export class Status {
    label: string;
    value: string;
    color: string;

    constructor() {
        this.label = 'P';
        this.value = 'Pendiente';
        this.color = 'danger';
    }
}

export class StateModel {
    key: string;
    action: string;
    value: TaskModel;

    constructor(){
        this.key = '';
        this.action = '';
        this.value = new TaskModel();
    }    
}

export class User {
    email: string;
    password: string;
    constructor(){
        this.email = 'ciro@gmail.com';
        this.password = '123';
    }
}
export class Token {
    token: string;
    constructor(){
        this.token = '';
    }
}