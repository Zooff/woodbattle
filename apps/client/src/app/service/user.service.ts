import { Injectable } from "@angular/core";
import { User } from "@woodbattle/shared/model";
import { v1 as uuid } from 'uuid'

const names = ['Zooff', 'Rik', 'Atoll', 'Tar']

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private user!: User 

    getActualUser() {
        return this.user
    }

    createUser(): User {
        this.user = {
            id: uuid(),
            name: names[Math.floor(Math.random()*names.length)]
        }

        return this.user
    }

    setUserName(name: string) {
        this.user.name = name
    }

    setSocketId(socketId: string) {
        this.user.socketId = socketId
    }
}