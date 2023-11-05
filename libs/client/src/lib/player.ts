import { Vector2 } from "@woodbattle/shared/model";
import { Sprite } from "./sprite";

export class Player extends Sprite {

    constructor (
        position: Vector2,
        image: HTMLImageElement,
        frame: number,
        frameSize: Vector2,
        frameSpace: number,
        vFrame: number,
        hFrame: number,
        scale: number
    ) {
        super(position, image, frame, frameSize, frameSpace, vFrame, hFrame, scale)
    }

}