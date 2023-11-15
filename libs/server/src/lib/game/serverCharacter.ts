import { BoxCollider, GameObject, PlayerCharacterState, User, Vector2 } from "@woodbattle/shared/model";

export interface ServerPlayerCharacter extends GameObject {

    user: User
    
    state: PlayerCharacterState

    speed: number

    collider: BoxCollider

    attackCoolDown: number
    lastAttack: number

}