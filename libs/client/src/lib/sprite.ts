import { Vector2 } from '@woodbattle/shared/model'

export class Sprite {

    public position: Vector2
    public image: HTMLImageElement
    public frame: number
    public frameSize: Vector2
    public hFrame: number
    public vFrame: number
    public scale: number

    private frames: { position: Vector2, frameSize: Vector2 }[] = []

    constructor(
        position: Vector2,
        image: HTMLImageElement,
        frame: number,
        frameSize: Vector2,
        frameSpace: number,
        hFrame: number,
        vFrame: number,
        scale: number
    ) {
        this.position = position ?? new Vector2(0, 0)
        this.image = image
        this.frame = frame ?? 0
        this.frameSize = frameSize ?? new Vector2(16, 16)
        this.hFrame = hFrame ?? 1
        this.vFrame = 1
        this.scale = scale ?? 1

        this.generateFrames()
    }

    public setScale ( scale: number) {
        this.scale = scale
    }


    generateFrames() {
        for (let i = 0; i<this.vFrame; i++) {
            for (let j = 0; j < this.hFrame; j++) {
                this.frames.push({
                    position: new Vector2(j, i),
                    frameSize: new Vector2(21, 32)
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

        ctx.strokeRect(this.position.x + 5, this.position.y + 8, 10, 16)
    }

}