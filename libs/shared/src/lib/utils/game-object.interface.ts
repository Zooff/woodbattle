import { Vector2 } from "./vector2";

export interface GameObject {
    position: Vector2
    type?: string
}

export interface Drawable {
    draw(ctx: CanvasRenderingContext2D): void
}