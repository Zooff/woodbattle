import { Injectable } from "@angular/core";
import { Player } from '@woodbattle/client'
import { Vector2 } from "@woodbattle/shared/model";
import { ConfigService } from "./config.service";
import { ResourceService } from "./resource.service";

@Injectable({
    providedIn: 'root'
})
export class GameStateService {

    private players: Player[] = []

    constructor(
        private configService: ConfigService,
        private resourceService: ResourceService
    ) {}


    createPlayer( position: Vector2) {

        console.log(this.resourceService.getImage(this.configService.playerSprite))

        const player = new Player(
            position,
            this.resourceService.getImage(this.configService.playerSprite)!,
            0,
            new Vector2(32, 32),
            0,
            4,
            5,
            2
        )

        this.players.push(player)

    }

    getAllPlayers() {
        return this.players
    }
}