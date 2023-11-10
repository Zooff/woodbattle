import {GameObject, User} from '@woodbattle/shared/model'

export class Game {
    
    public users: {[id: string]: User}
    public roomName: string

    private framerate: number

    private tickInterval!: NodeJS.Timer

    private gameObjects: GameObject[] = []

    constructor( users: User[], roomName: string, framerate?: number) {
        this.users = {}
        for (const user of users) {
            this.users[user.id] = user
        }
        this.roomName = roomName
        this.framerate = framerate || 15
    }


    public init() {
        let start = true
        for (const user in this.users) {
            if (!this.users[user].isReady) {
                start = false
            }
        }

        if (!start) return false

        return true
    }

    public tick() {



        this.tickInterval = setInterval(this.tick, this.framerate)
    }
}