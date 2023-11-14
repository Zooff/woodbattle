import { Injectable } from "@angular/core";
import { NpcCharacter, PlayerCharacter } from '@woodbattle/client'
import { GameObject, IGame, IPlayerCharacters, Vector2 } from "@woodbattle/shared/model";
import { ConfigService } from "./config.service";
import { ResourceService } from "./resource.service";
import { SocketService } from "./socket.service";
import { SettingsService } from "./settings.service";

@Injectable({
    providedIn: 'root'
})
export class GameStateService implements IGame {

    public playerCharacters: {[id: string]: PlayerCharacter} = {}
    public gameObjects: any[] = [];
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

        for (const gameObject of game.gameObjects) {
           this.createGameObject(gameObject)
        }
    }

    updateGame( playerCharacters: {[id: string]:IPlayerCharacters}, gameObjects: GameObject[]) {
        for (const player in playerCharacters) {
            if (!this.playerCharacters[player]) continue
            this.playerCharacters[player].position = playerCharacters[player].position
        }

        for (let i = 0; i < gameObjects.length; i++) {
            if (!this.gameObjects[i]) continue
            this.gameObjects[i].position = gameObjects[i].position
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
            6,
            scale ?? 1,
            speed
        )

    }

    private createGameObject(gameObject: any) {
        if (gameObject.type === 'npc') {
            this.gameObjects.push(new NpcCharacter(
                gameObject.position,
                this.resourceService.getImage(this.configService.sprite.smith.image)!,
                0,
                new Vector2(32, 32),
                0,
                1,
                8,
                this.settingsService.scale
            ))
        }
    }

    getAllPlayers() {
        return this.playerCharacters
    }
    
}