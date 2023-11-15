import { IPlayerCharacters, PlayerCharacterState, Vector2 } from "@woodbattle/shared/model";
import { Sprite } from "./sprite";
import { Frame, FrameProps } from "./sprite.interface";


const swordmanFrame: { [id: string]: Frame[] } = {
    idle: [{ position: new Vector2(0, 0), frameSize: new Vector2(24, 30) }, { position: new Vector2(64, 0), frameSize: new Vector2(24, 30) }, { position: new Vector2(128, 0), frameSize: new Vector2(24, 30) }, { position: new Vector2(192, 0), frameSize: new Vector2(24, 30) }, { position: new Vector2(256, 0), frameSize: new Vector2(24, 30) }, { position: new Vector2(320, 0), frameSize: new Vector2(24, 30) }],
    moving: [{ position: new Vector2(0, 64), frameSize: new Vector2(24, 30) }, { position: new Vector2(64, 64), frameSize: new Vector2(24, 30) }, { position: new Vector2(128, 64), frameSize: new Vector2(24, 30) }, { position: new Vector2(192, 64), frameSize: new Vector2(24, 30) }, { position: new Vector2(253, 64), frameSize: new Vector2(24, 30) }, { position: new Vector2(320, 64), frameSize: new Vector2(24, 30) }],
    attack: [{ position: new Vector2(0, 188), frameSize: new Vector2(24, 32) }, { position: new Vector2(64, 188), frameSize: new Vector2(24, 32) }, { position: new Vector2(120, 188), frameSize: new Vector2(32, 32) }, { position: new Vector2(192, 188), frameSize: new Vector2(46, 32) }, { position: new Vector2(260, 188), frameSize: new Vector2(38, 32) }, { position: new Vector2(320, 188), frameSize: new Vector2(27, 32) }]
}

export class PlayerCharacter extends Sprite implements IPlayerCharacters {

    speed: number
    state: PlayerCharacterState = PlayerCharacterState.IDLE
    stateHasChange: boolean = false

    private staggerAnim = 25
    private gameFrame = 0

    private showGizmo = true

    constructor(
        position: Vector2,
        image: HTMLImageElement,
        frame: number,
        scale: number,
        speed: number
    ) {




        super(position, image, frame, null, swordmanFrame['idle'], scale)
        this.speed = speed ?? 10
    }


    override draw(ctx: CanvasRenderingContext2D) {

        if (this.stateHasChange) this.frame = 0
        if (this.state === PlayerCharacterState.IDLE) {

            this.frames = swordmanFrame['idle']
        }
        if (this.state === PlayerCharacterState.MOVING) {
            this.frames = swordmanFrame['moving']
        }

        if (this.state === PlayerCharacterState.ATTACKING) {
            this.frames = swordmanFrame['attack']
        }

        super.draw(ctx)
        if (this.gameFrame % this.staggerAnim === 0) {
            this.frame = this.frame + 1
            if (this.frame === this.frames.length) this.frame = 0
        }
        this.gameFrame++

        // Gizmo
        if (this.showGizmo) {
            ctx.strokeRect((this.position.x + 5) * this.scale, (this.position.y + 8) * this.scale, 10 * this.scale, 16 * this.scale)
            
            if (this.state === PlayerCharacterState.ATTACKING && this.frame === 3) {
                console.log('ATTACK')
                ctx.strokeStyle = 'green'
                ctx.strokeRect((this.position.x + 15) * this.scale, (this.position.y + 8) * this.scale, 32 * this.scale, 15 * this.scale)
                ctx.strokeStyle = 'black'
            }
        }

    }



}