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
        super(position, image, frame, frameSize, frameSpace, hFrame, vFrame, scale)
        this.speed = speed ?? 10
    }


    override draw(ctx: CanvasRenderingContext2D) {

        super.draw(ctx)
        this.frame ++
        if (this.frame <= this.hFrame) this.frame = 0
        ctx.strokeRect(this.position.x + 5, this.position.y + 8, 10, 16)
    }

    

}