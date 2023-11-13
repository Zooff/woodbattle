import { GameObject } from "./game-object.interface";

export function isRectColliding(rect1: BoxCollider, rect2: BoxCollider): boolean {
    // Vérifie si les rectangles se chevauchent
    return (
        rect1.position.x < rect2.position.x + rect2.width &&
        rect1.position.x + rect1.width > rect2.position.x &&
        rect1.position.y < rect2.position.y + rect2.height &&
        rect1.position.y + rect1.height > rect2.position.y
    );
}

export interface BoxCollider extends GameObject {
    width: number,
    height: number
    layer: string
}