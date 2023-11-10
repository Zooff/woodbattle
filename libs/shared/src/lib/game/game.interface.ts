import { GameObject } from "../utils/game-object.interface";
import { Vector2 } from "../utils/vector2";

export interface IGame {
    playerCharacters: {[id: string]: GameObject}
    actualMap: string

    spawnPosition: Vector2[]
}