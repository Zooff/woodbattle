import { GameMap, GameObject, IGame, PlayerCharacterState, PlayerInput, Sword, User, Vector2, isRectColliding } from '@woodbattle/shared/model'
import { ServerPlayerCharacter } from './serverCharacter'
import { Observable, Subject } from 'rxjs'
import { Boundary } from 'libs/shared/src/lib/utils/quadtree'

export class Game implements IGame {

    public users: { [id: string]: User }
    public roomName: string
    public actualMap: string = ''

    public playerCharacters: { [id: string]: ServerPlayerCharacter } = {}

    public spawnPosition: Vector2[] = []

    private framerate: number

    private tickInterval!: NodeJS.Timer

    public gameObjects: GameObject[] = []

    private playersInputs: { [id: string]: PlayerInput } = {}

    private map: GameMap

    private source: Subject<any> = new Subject<any>()
    public $update: Observable<any> = new Observable<any>()

    private lastRun: number = 0

    private runDuration: number[] = []



    constructor(users: User[], roomName: string, map: GameMap, framerate?: number) {
        console.log('NEW GAME', users)
        this.users = {}
        this.map = map
        this.spawnPosition = JSON.parse(JSON.stringify(map.spawnPoint))
        this.gameObjects = JSON.parse(JSON.stringify(map.gameObjects))
        for (let i = 0; i < users.length; i++) {
            const selectedSpawn = this.spawnPosition[i % this.spawnPosition.length]
            this.users[users[i].id] = users[i]
            this.playerCharacters[users[i].id] = {
                user: users[i],
                position: new Vector2(selectedSpawn.x, selectedSpawn.y),
                state: PlayerCharacterState.IDLE,
                speed: 3,
                collider: {
                    position: new Vector2(5, 8),
                    width: 10,
                    height: 16,
                    layer: 'player'
                },
                attackCoolDown: 1500,
                lastAttack: 0,
                direction: new Vector2(1, 0),
                width: 10,
                height: 16,
                weapon: new Sword(),
                lastParryActivation: 0,
                parryDuration: 300,
                parryCoolDown: 1000
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
        console.log('GAME INIT', this.roomName)
        let start = true
        for (const user in this.users) {
            if (!this.users[user].isReady) {
                start = false
            }
        }

        if (!start) return false

        this.lastRun = Date.now()
        this.tick()
        return true
    }

    private tick() {

        if (this.tickInterval) clearInterval(this.tickInterval)

        const now = Date.now()
        this.runDuration.push(now - this.lastRun)
        if (this.runDuration.length > 100) this.runDuration.pop
        this.lastRun = now

        this.updatePlayers()

        const update = {
            playerCharacters: this.playerCharacters,
            gameObjects: this.getGameObjects()
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

    public setMap(map: GameMap) {
        this.map = map
    }

    public getGameObjects() {
        return this.gameObjects
    }

    private updatePlayers() {
        for (const id in this.playerCharacters) {
            let player: ServerPlayerCharacter = this.playerCharacters[id]

            if (!player) continue

            if (player.state === PlayerCharacterState.DEAD) continue

            let speed = player.speed

            const now = Date.now()

            if (now - player.lastParryActivation > player.parryCoolDown && this.playersInputs[id].parry) {
                player.state = PlayerCharacterState.PARRY
                player.lastParryActivation = now
            }

            if (player.state === PlayerCharacterState.PARRY) {
                if (now - player.lastParryActivation > player.parryDuration) {
                    player.state = PlayerCharacterState.IDLE
                }
            }

            if (this.playersInputs[id].attack) {
                if (now - player.lastAttack > player.attackCoolDown ) {
                    player.state = PlayerCharacterState.ATTACKING
                    player.lastAttack = now
                    player.weapon.attack(player, Object.values(this.playerCharacters))
                }
            }

            if (player.state === PlayerCharacterState.ATTACKING) {
                console.log(now - player.lastAttack)
                if (now - player.lastAttack < 800) {
                    speed /= 4
                }

                if (now - player.lastAttack > 1000) {
                    player.state = PlayerCharacterState.IDLE
                }
            }

            if (this.playersInputs[id].dash) {
                player.state = PlayerCharacterState.DASHING
                speed *= 4
            }

          
            let nextPosition = new Vector2(player.position.x, player.position.y)

            if (this.playersInputs[id].up && this.playersInputs[id].left
                || this.playersInputs[id].up && this.playersInputs[id].right
                || this.playersInputs[id].down && this.playersInputs[id].left
                || this.playersInputs[id].down && this.playersInputs[id].right
            ) {
                speed = 1 / Math.sqrt(2) * speed
            }


            if (this.playersInputs[id].up) {
                nextPosition.y -= speed
                player.direction.y = 1
            }
        
            if (this.playersInputs[id].down) {
                nextPosition.y += speed
                player.direction.y = -1
            }
            if (this.playersInputs[id].right) {
                nextPosition.x += speed
                player.direction.x = 1
            }
            if (this.playersInputs[id].left) {
                nextPosition.x -= speed
                player.direction.x = -1
            }

            if ( player.state !== PlayerCharacterState.ATTACKING && player.state !== PlayerCharacterState.PARRY) {
                if (nextPosition.equals(player.position)) {
                    player.state = PlayerCharacterState.IDLE
                }
                else {
                    player.state = PlayerCharacterState.MOVING
                }
            }
            

            const walls = this.map.collision.retrieve(new Boundary(nextPosition.x, nextPosition.y, speed * 2, speed * 2))

            let hasCollided = false
            for (const wall of walls) {
                const collider = {position: new Vector2(nextPosition.x + player.collider.position.x, nextPosition.y + player.collider.position.y), width: player.collider.width, height: player.collider.height, layer: 'player'}
                if (isRectColliding(wall,  collider)) {
                    hasCollided = true
                    break
                }
            }

            if (!hasCollided) player.position = nextPosition

            // player.position.normalize()

        }
    }

    public destroy() {
        clearTimeout(this.tickInterval)
    }
}