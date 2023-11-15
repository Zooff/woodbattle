import { Vector2 } from "@woodbattle/shared/model";

export interface FrameProps {
    frameSize: Vector2,
    frameSpace: Vector2,
    hFrame: number,
    vFrame: number
}

export interface Frame {
    position: Vector2
    frameSize: Vector2
}