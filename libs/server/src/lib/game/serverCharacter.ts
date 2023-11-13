import { BoxCollider, GameObject, User, Vector2 } from "@woodbattle/shared/model";

export interface ServerPlayerCharacter extends GameObject {

    user: User
    isMoving: boolean
    isAttacking: boolean

    speed: number

    collider: BoxCollider

}