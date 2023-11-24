import { IPlayerCharacters, PlayerCharacterState, Sword, Vector2, Weapon } from "@woodbattle/shared/model";
import { Sprite } from "./sprite";
import { Frame, FrameProps } from "./sprite.interface";


const swordmanFrame: { [id: string]: Frame[] } = {
    idle: [{ position: new Vector2(0, 0), frameSize: new Vector2(24, 30) }, { position: new Vector2(64, 0), frameSize: new Vector2(24, 30) }, { position: new Vector2(128, 0), frameSize: new Vector2(24, 30) }, { position: new Vector2(192, 0), frameSize: new Vector2(24, 30) }, { position: new Vector2(256, 0), frameSize: new Vector2(24, 30) }, { position: new Vector2(320, 0), frameSize: new Vector2(24, 30) }],
    moving: [{ position: new Vector2(0, 64), frameSize: new Vector2(24, 30) }, { position: new Vector2(64, 64), frameSize: new Vector2(24, 30) }, { position: new Vector2(128, 64), frameSize: new Vector2(24, 30) }, { position: new Vector2(192, 64), frameSize: new Vector2(24, 30) }, { position: new Vector2(253, 64), frameSize: new Vector2(24, 30) }, { position: new Vector2(320, 64), frameSize: new Vector2(24, 30) }],
    attack: [{ position: new Vector2(0, 188), frameSize: new Vector2(24, 32) }, { position: new Vector2(64, 188), frameSize: new Vector2(24, 32) }, { position: new Vector2(120, 188), frameSize: new Vector2(32, 32) }, { position: new Vector2(192, 188), frameSize: new Vector2(46, 32) }, { position: new Vector2(260, 188), frameSize: new Vector2(38, 32) }, { position: new Vector2(320, 188), frameSize: new Vector2(27, 32) }],
    dying: [{ position: new Vector2(0, 128), frameSize: new Vector2(24, 32) }, { position: new Vector2(64, 128), frameSize: new Vector2(24, 32) }, { position: new Vector2(120, 128), frameSize: new Vector2(32, 32) }, { position: new Vector2(192, 128), frameSize: new Vector2(32, 40) }, { position: new Vector2(260, 128), frameSize: new Vector2(32, 40) }, { position: new Vector2(320, 128), frameSize: new Vector2(32, 40) }]

}

export class PlayerCharacter extends Sprite implements IPlayerCharacters {

    speed: number
    state: PlayerCharacterState = PlayerCharacterState.IDLE
    stateHasChange: boolean = false

    height: number = 16
    width: number = 10

    direction: Vector2 = new Vector2(-1, 0)

    private staggerAnim = 8
    private gameFrame = 0

    private showGizmo = true

    weapon: Weapon

    constructor(
        position: Vector2,
        image: HTMLImageElement,
        frame: number,
        scale: number,
        speed: number
    ) {




        super(position, image, frame, null, swordmanFrame['idle'], scale)
        this.speed = speed ?? 10
        this.weapon = new Sword()
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

        if (this.state === PlayerCharacterState.DEAD) {
            this.frames = swordmanFrame['dying']
        }

        if (this.direction.x === -1) {
            ctx.save()
            ctx.scale(this.direction.x, 1)
        }

        super.draw(ctx, this.direction.x)
        if (this.gameFrame % this.staggerAnim === 0) {
            this.frame++
            if (this.state !== PlayerCharacterState.DEAD && this.frame === this.frames.length) this.frame = 0
            if (this.state === PlayerCharacterState.DEAD && this.frame === this.frames.length) this.frame = this.frames.length - 1
        }
        this.gameFrame++

        // Gizmo
        if (this.showGizmo) {
            ctx.fillStyle = 'pink'
            ctx.fillRect(this.position.x * this.direction.x, this.position.y, 10 * this.direction.x, 10)
            ctx.fillStyle = 'black'
            ctx.strokeRect((this.position.x + 5) * this.direction.x * this.scale, (this.position.y + 8) * this.scale, 10 * this.scale * this.direction.x, 16 * this.scale)

            ctx.fillStyle = 'blue'
            ctx.fillRect((this.position.x + 5) * this.direction.x * this.scale, (this.position.y + 8) * this.scale, 1 * this.scale * this.direction.x, 1 * this.scale)
            ctx.fillStyle = 'black'

            if (this.state === PlayerCharacterState.ATTACKING && this.frame === 3) {
                console.log('ATTACK')
                ctx.strokeStyle = 'green'
                ctx.strokeRect((this.position.x + 15 * this.direction.x) * this.direction.x * this.scale, (this.position.y + 8) * this.scale, 32 * this.scale * this.direction.x, 15 * this.scale)
                ctx.strokeStyle = 'black'
            }

            if (this.state === PlayerCharacterState.PARRY) {
                ctx.strokeStyle = 'blue'
                ctx.beginPath();
                ctx.arc((this.position.x + 16) * this.scale * this.direction.x, (this.position.y + 16) * this.scale, 16, Math.PI *3 /2, Math.PI / 2);
                ctx.stroke()
                ctx.strokeStyle = 'black'
            }
        }

        if (this.direction.x === -1) {
            ctx.restore()
        }


    }



}