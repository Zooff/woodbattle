import { v1 as uuid } from 'uuid'

export class Lobby {

    private id: string

    constructor() {
        this.id = uuid()
    }
}