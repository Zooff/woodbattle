import {GameObject, IGame, PlayerInput, User, Vector2} from '@woodbattle/shared/model'
import { ServerPlayerCharacter } from './serverCharacter'
import { Observable, Subject } from 'rxjs'

export class Game implements IGame {
    
    public users: {[id: string]: User}
    public roomName: string
    public actualMap: string = ''

    public playerCharacters: {[id: string]: ServerPlayerCharacter} = {}

    public spawnPosition: Vector2[] = []

    private framerate: number

    private tickInterval!: NodeJS.Timer

    private gameObjects: GameObject[] = []

    private playersInputs: {[id: string]: PlayerInput} = {}

    private source: Subject<any> = new Subject<any>()
    public $update: Observable<any> = new Observable<any>()

    

    constructor( users: User[], roomName: string, spawns: Vector2[], framerate?: number) {
        this.users = {}
        this.spawnPosition = spawns
        for (let i = 0; i < users.length; i++) {
            this.users[users[i].id] = users[i]
            this.playerCharacters[users[i].id] = {
                user: users[i],
                position: this.spawnPosition[i % this.spawnPosition.length],
                isMoving: false,
                isAttacking: false,
                speed: 10
            }
            this.playersInputs[users[i].id] = {
                up: false,
                down: false,
                left: false,
                right: false,

                attack: false,
                parry: false,
                dash: false,
                action1: false
            }
        }
        this.roomName = roomName
        this.framerate = framerate || 15

        this.actualMap = 'shop'

        this.$update = this.source.asObservable()
    }


    public init() {
        let start = true
        for (const user in this.users) {
            if (!this.users[user].isReady) {
                start = false
            }
        }

        if (!start) return false

        this.tick()
        return true
    }

    public tick() {

        this.movePlayers()

        const update = {
            playerCharacters: this.playerCharacters
        }
        this.source.next(update)
        this.tickInterval = setTimeout(this.tick.bind(this), this.framerate)
    }

    public getPlayers() {
        return this.playerCharacters
    }

    public setPlayerInputs(userId: string, playerInput: Partial<PlayerInput>) {

        console.log('SET INPUT', userId, playerInput)

        if (!this.playersInputs[userId]) return
        for (const input in playerInput) {
            this.playersInputs[userId][input as keyof PlayerInput] = playerInput[input as keyof PlayerInput]
        }
    }

    private movePlayers() {
        for (const id in this.playerCharacters) {
            let player: ServerPlayerCharacter = this.playerCharacters[id]

            if (!player) continue
            if (this.playersInputs[id].up) [
                player.position.y += player.speed
            ]
            if (this.playersInputs[id].down) [
                player.position.y -= player.speed
            ]
            if (this.playersInputs[id].right) [
                player.position.x += player.speed
            ]
            if (this.playersInputs[id].left) [
                player.position.x -= player.speed
            ]

            console.log(player.position)
        }
    }

    public destroy() {
        clearTimeout(this.tickInterval)
    }
}