import { Injectable } from "@angular/core";
import { Vector2 } from "@woodbattle/shared/model";

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    server: string = 'http://localhost:3000/api/'

    playerSprite: string = 'swordman'

    framerate = 15

    sprite = {
        swordman: {
            image: 'swordman'
        },
        smith: {
            image: 'smith',
            hFrame: 8,
            vFrame: 1,
            frameSize: new Vector2(32, 32),
            hSpace: 0,
            vSpace: 0

        }
    }
}  