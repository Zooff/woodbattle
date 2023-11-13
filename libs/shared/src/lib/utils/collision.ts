export function isRectColliding(rect1: BoxCollider, rect2: BoxCollider): boolean {
    // Vérifie si les rectangles se chevauchent
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

export interface BoxCollider {
    x: number,
    y: number,
    width: number,
    height: number
}