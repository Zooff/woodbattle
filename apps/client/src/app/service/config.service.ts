import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    server: string = 'http://localhost:3000/api/'

    playerSprite: string = 'swordman'
}  