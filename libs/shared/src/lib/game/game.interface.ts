import { Weapon } from "../..";
import { GameObject } from "../utils/game-object.interface";
import { Vector2 } from "../utils/vector2";

export interface IGame {
    playerCharacters: {[id: string]: IPlayerCharacters}
    gameObjects: GameObject[]
    actualMap: string

    spawnPosition: Vector2[]
}

export enum PlayerCharacterState {
    IDLE, MOVING, ATTACKING, DASHING, DEAD, PARRY
}

export interface IPlayerCharacters extends GameObject {
    speed: number
    state: PlayerCharacterState
    direction: Vector2
    height: number
    width: number
    weapon: Weapon
}

