import { v1 as uuid } from 'uuid'

export class Room implements Room {

    private id: string

    constructor() {
        this.id = uuid()
    }
}