import { Drawable, Vector2 } from "@woodbattle/shared/model";
import { Sprite } from "./sprite";
import { FrameProps } from "./sprite.interface";

export class NpcCharacter extends Sprite implements Drawable {

    private staggerAnim = 10
    private gameFrame = 0

    constructor (
        position: Vector2,
        image: HTMLImageElement,
        frame: number,
        frameProps: FrameProps,
        scale: number,
    ) {
        super(position, image, frame, frameProps, null, scale)
    }

    override draw(ctx: CanvasRenderingContext2D) {

        super.draw(ctx)

        if ( this.gameFrame % this.staggerAnim === 0 ) {
            this.frame = this.frame + 1
            if (this.frame === this.frameProps.hFrame) this.frame = 0
        }
        this.gameFrame++
       
    }
}