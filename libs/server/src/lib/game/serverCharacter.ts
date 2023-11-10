import { GameObject, User, Vector2 } from "@woodbattle/shared/model";

export interface ServerPlayerCharacter extends GameObject {

    user: User
    position: Vector2

    isMoving: boolean
    isAttacking: boolean

}