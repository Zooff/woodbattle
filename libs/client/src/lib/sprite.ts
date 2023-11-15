import { Vector2 } from '@woodbattle/shared/model'
import { Frame, FrameProps } from './sprite.interface'

export class Sprite {

    public position: Vector2
    public image: HTMLImageElement
    public frame: number
    public frameProps: FrameProps
    public scale: number

    public frames: Frame[] = []

    constructor(
        position: Vector2,
        image: HTMLImageElement,
        frame: number,
        frameProps: FrameProps | null,
        frames: Frame[] | null,
        scale: number
    ) {
        this.position = position ?? new Vector2(0, 0)
        this.image = image
        this.frame = frame ?? 0
        this.frameProps = frameProps as FrameProps
        this.scale = scale ?? 1
        this.frames = frames as Frame[] ?? []

        console.log(frameProps)
        if (frameProps) {
            this.generateFrames()
        }
        
       
    }

    public setScale ( scale: number) {
        this.scale = scale
    }


    generateFrames() {
        for (let i = 0; i<this.frameProps.vFrame; i++) {
            for (let j = 0; j < this.frameProps.hFrame; j++) {
                this.frames.push({
                    position: new Vector2(j * this.frameProps.frameSize.x, i * this.frameProps.frameSize.y),
                    frameSize: this.frameProps.frameSize
                })
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {

        ctx.drawImage(this.image,
            this.frames[this.frame].position.x,
            this.frames[this.frame].position.y,
            this.frames[this.frame].frameSize.x,
            this.frames[this.frame].frameSize.y,
            this.position.x * this.scale,
            this.position.y * this.scale,
            this.frames[this.frame].frameSize.x * this.scale,
            this.frames[this.frame].frameSize.y * this.scale
        )

    }

}