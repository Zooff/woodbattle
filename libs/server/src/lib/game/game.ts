import { GameObject, IGame, PlayerInput, User, Vector2 } from '@woodbattle/shared/model'
import { ServerPlayerCharacter } from './serverCharacter'
import { Observable, Subject } from 'rxjs'

export class Game implements IGame {

    public users: { [id: string]: User }
    public roomName: string
    public actualMap: string = ''

    public playerCharacters: { [id: string]: ServerPlayerCharacter } = {}

    public spawnPosition: Vector2[] = []

    private framerate: number

    private tickInterval!: NodeJS.Timer

    private gameObjects: GameObject[] = []

    private playersInputs: { [id: string]: PlayerInput } = {}

    private source: Subject<any> = new Subject<any>()
    public $update: Observable<any> = new Observable<any>()



    constructor(users: User[], roomName: string, spawns: Vector2[], framerate?: number) {
        console.log('NEW GAME', spawns, users)
        this.users = {}
        this.spawnPosition = spawns
        for (let i = 0; i < users.length; i++) {
            const selectedSpawn = this.spawnPosition[i % this.spawnPosition.length]
            this.users[users[i].id] = users[i]
            this.playerCharacters[users[i].id] = {
                user: users[i],
                position: new Vector2(selectedSpawn.x, selectedSpawn.y),
                isMoving: false,
                isAttacking: false,
                speed: 3
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

        console.log(this.playerCharacters)
    }


    public init() {
        console.log('GAME INIT', this.roomName)
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

    private tick() {

        if (this.tickInterval) clearInterval(this.tickInterval)

        this.movePlayers()

        const update = {
            playerCharacters: this.playerCharacters
        }
        this.source.next(update)
        this.tickInterval = setTimeout(() => this.tick(), this.framerate)
    }

    public getPlayers() {
        return this.playerCharacters
    }

    public setPlayerInputs(userId: string, playerInput: Partial<PlayerInput>) {
        if (!this.playersInputs[userId]) return
        for (const input in playerInput) {
            this.playersInputs[userId][input as keyof PlayerInput] = playerInput[input as keyof PlayerInput]
        }
    }

    private movePlayers() {
        for (const id in this.playerCharacters) {
            let player: ServerPlayerCharacter = this.playerCharacters[id]

            if (!player) continue

            let speed = player.speed

            if (this.playersInputs[id].up && this.playersInputs[id].left
                || this.playersInputs[id].up && this.playersInputs[id].right
                || this.playersInputs[id].down && this.playersInputs[id].left
                || this.playersInputs[id].down && this.playersInputs[id].right
            ) {
                speed = 1 / Math.sqrt(2) * speed
            }

            if (this.playersInputs[id].up) [
                player.position.y -= speed
            ]
            if (this.playersInputs[id].down) [
                player.position.y += speed
            ]
            if (this.playersInputs[id].right) [
                player.position.x += speed
            ]
            if (this.playersInputs[id].left) [
                player.position.x -= speed
            ]

            // player.position.normalize()

        }
    }

    public destroy() {
        clearTimeout(this.tickInterval)
    }
}