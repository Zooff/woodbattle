import {GameObject, IGame, User, Vector2} from '@woodbattle/shared/model'
import { ServerPlayerCharacter } from './serverCharacter'

export class Game implements IGame {
    
    public users: {[id: string]: User}
    public roomName: string
    public actualMap: string = ''

    private framerate: number

    private tickInterval!: NodeJS.Timer

    private gameObjects: GameObject[] = []

    public playerCharacters: {[id: string]: ServerPlayerCharacter} = {}

    public spawnPosition: Vector2[] = []

    constructor( users: User[], roomName: string, framerate?: number) {
        this.users = {}
        for (const user of users) {
            this.users[user.id] = user
            this.playerCharacters[user.id] = {
                user: user,
                position: new Vector2(Math.floor(Math.random() * (100 - 10 + 1)), Math.floor(Math.random() * (60 - 10 + 1)) ),
                isMoving: false,
                isAttacking: false
            }
        }
        this.roomName = roomName
        this.framerate = framerate || 15

        this.actualMap = 'shop'
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

    public getPlayers() {
        return this.playerCharacters
    }
}