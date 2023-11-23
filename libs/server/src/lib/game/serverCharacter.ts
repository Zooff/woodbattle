import { BoxCollider, GameObject, IPlayerCharacters, PlayerCharacterState, User, Vector2 } from "@woodbattle/shared/model";

export interface ServerPlayerCharacter extends  IPlayerCharacters  {

    user: User
    
    state: PlayerCharacterState

    speed: number

    direction: Vector2

    collider: BoxCollider

    attackCoolDown: number
    lastAttack: number

    lastParryActivation: number
    parryDuration: number
    parryCoolDown: number
}