import { Drawable, Vector2 } from "@woodbattle/shared/model";
import { Sprite } from "./sprite";

export class NpcCharacter extends Sprite implements Drawable {

    private staggerAnim = 25
    private gameFrame = 0

    constructor (
        position: Vector2,
        image: HTMLImageElement,
        frame: number,
        frameSize: Vector2,
        frameSpace: number,
        vFrame: number,
        hFrame: number,
        scale: number,
    ) {
        super(position, image, frame, frameSize, frameSpace, hFrame, vFrame, scale)
    }

    override draw(ctx: CanvasRenderingContext2D) {

        super.draw(ctx)

        if ( this.gameFrame % this.staggerAnim === 0 ) {
            this.frame = this.frame + 1
            if (this.frame === this.hFrame) this.frame = 0
        }
        this.gameFrame++
       
    }
}