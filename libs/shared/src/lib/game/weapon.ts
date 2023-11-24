import { BoxCollider, isRectColliding } from '../utils/collision'
import { Vector2 } from '../utils/vector2'
import { IPlayerCharacters, PlayerCharacterState } from './game.interface'

export interface Weapon {

    damage: boolean
    cooldown: number
    knockback: number
    collider: BoxCollider

    activeCollider: {
        start: number,
        end: number
    }

    attack(player: IPlayerCharacters, players: {[id: string]: IPlayerCharacters}): void
    clear(): void
}

export class Sword implements Weapon {

    damage: boolean = true
    cooldown: number = 1500
    knockback: number = 100

    activeCollider = {
        start: 24 * 1000 / 60,
        end: 40 * 1000 / 60
    }

    collider: BoxCollider = {
        position: new Vector2(15, 8),
        width: 32,
        height: 15,
        layer: 'player'
    }

    private alreadyHit: string[] = []

    attack(player: IPlayerCharacters, players: {[id: string]: IPlayerCharacters}) {

        const now = performance.now()
        
        const playerCollider: BoxCollider = {
            position: new Vector2(
                player.position.x + (this.collider.position.x * player.direction.x),
                player.position.y + this.collider.position.y,
            ),
            height: this.collider.height,
            width: this.collider.width,
            layer: this.collider.layer
        }
        for (const id in players) {
            const p = players[id]
            if (isRectColliding(playerCollider, {position: p.position, width: p.width, height: p.height, layer: 'player'})) {
               
                if (this.alreadyHit.includes(id)) return
                this.alreadyHit.push(id)
                console.log('ATTACK TOUCH')
                if (p.state !== PlayerCharacterState.DEAD) {
                    
                    if (p.state === PlayerCharacterState.ATTACKING) {
                        console.log('CLASH')
                    }

                    else if (p.state === PlayerCharacterState.PARRY) {
                        console.log('PARRY YEAH')
                    }

                    else {
                        p.state = PlayerCharacterState.DEAD
                    }
                }
            }
        }
    }

    clear(): void {
        this.alreadyHit = []
    }

}