import { BoxCollider, isRectColliding } from '../utils/collision'
import { Vector2 } from '../utils/vector2'
import { IPlayerCharacters, PlayerCharacterState } from './game.interface'

export interface Weapon {

    damage: boolean
    cooldown: number
    knockback: number
    collider: BoxCollider

    attack(player: IPlayerCharacters, players: IPlayerCharacters[]): void
}

export class Sword implements Weapon {

    damage: boolean = true
    cooldown: number = 1500
    knockback: number = 100

    collider: BoxCollider = {
        position: new Vector2(15, 8),
        width: 32,
        height: 15,
        layer: 'player'
    }

    attack(player: IPlayerCharacters, players: IPlayerCharacters[]) {

        
        const playerCollider: BoxCollider = {
            position: new Vector2(
                player.position.x + (this.collider.position.x * player.direction.x),
                player.position.y + this.collider.position.y,
            ),
            height: this.collider.height,
            width: this.collider.width,
            layer: this.collider.layer
        }
        for (const p of players) {
            if (isRectColliding(playerCollider, {position: p.position, width: p.width, height: p.height, layer: 'player'})) {
                console.log('ATTACK TOUCH')
                if (p.state !== PlayerCharacterState.DEAD) {
                    
                    if (p.state === PlayerCharacterState.ATTACKING) {

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

}