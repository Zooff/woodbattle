import { IPlayerCharacters, Vector2 } from "@woodbattle/shared/model";
import { Sprite } from "./sprite";

export class PlayerCharacter extends Sprite implements IPlayerCharacters {

    speed: number

    constructor (
        position: Vector2,
        image: HTMLImageElement,
        frame: number,
        frameSize: Vector2,
        frameSpace: number,
        vFrame: number,
        hFrame: number,
        scale: number,
        speed: number
    ) {
        super(position, image, frame, frameSize, frameSpace, vFrame, hFrame, scale)
        this.speed = speed ?? 10
    }

    

}