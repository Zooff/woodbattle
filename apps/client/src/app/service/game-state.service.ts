import { Injectable } from "@angular/core";
import { PlayerCharacter } from '@woodbattle/client'
import { GameObject, IGame, Vector2 } from "@woodbattle/shared/model";
import { ConfigService } from "./config.service";
import { ResourceService } from "./resource.service";
import { SocketService } from "./socket.service";
import { SettingsService } from "./settings.service";

@Injectable({
    providedIn: 'root'
})
export class GameStateService implements IGame {

    public playerCharacters: {[id: string]: PlayerCharacter} = {}
    public actualMap: string = '';
    public spawnPosition: Vector2[] = [];

    constructor(
        private configService: ConfigService,
        private resourceService: ResourceService,
        private socketService: SocketService,
        private settingsService: SettingsService
    ) {}



    init(game: IGame) {
        for (const player in game.playerCharacters) {
            this.playerCharacters[player] = this.createPlayer(game.playerCharacters[player].position, 
                game.playerCharacters[player].speed, 
                this.settingsService.scale
                )
        }
    }

    private createPlayer( position: Vector2, speed: number, scale: number) {

        // console.log(this.resourceService.getImage(this.configService.playerSprite))

        return new PlayerCharacter(
            position,
            this.resourceService.getImage(this.configService.playerSprite)!,
            0,
            new Vector2(32, 32),
            0,
            4,
            5,
            scale ?? 1,
            speed
        )

    }

    getAllPlayers() {
        return this.playerCharacters
    }
}