import { Injectable } from "@angular/core";
import { PlayerCharacter } from '@woodbattle/client'
import { Vector2 } from "@woodbattle/shared/model";
import { ConfigService } from "./config.service";
import { ResourceService } from "./resource.service";

@Injectable({
    providedIn: 'root'
})
export class GameStateService {

    private players: PlayerCharacter[] = []

    constructor(
        private configService: ConfigService,
        private resourceService: ResourceService
    ) {}git 


    createPlayer( position: Vector2, scale: number) {

        console.log(this.resourceService.getImage(this.configService.playerSprite))

        const player = new PlayerCharacter(
            position,
            this.resourceService.getImage(this.configService.playerSprite)!,
            0,
            new Vector2(32, 32),
            0,
            4,
            5,
            scale ?? 1
        )

        this.players.push(player)

    }

    getAllPlayers() {
        return this.players
    }
}