import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Game } from '@woodbattle/server'
import { IGame, PlayerInput, User, Vector2 } from '@woodbattle/shared/model';
import { GameMapService } from '../game-map/game-map.service';
import { Subscription } from 'rxjs';
import { GameGateway } from './game.gateway';

@Injectable()
export class GameService {


    private games: {[id: string]: Game} = {}

    private gamesUpdate: {[id: string]: Subscription} = {}

    constructor(
        private gameMapService: GameMapService,
        @Inject(forwardRef(() => GameGateway))
        private gameGateway: GameGateway
    ) {}

    getAllGames() {
        let resGame: {[id: string]: IGame} = {}
        for (const room in this.games) {
            resGame[room] = {
                actualMap: this.games[room].actualMap,
                playerCharacters: this.games[room].playerCharacters,
                spawnPosition: this.games[room].spawnPosition
            
            }
        }
        return resGame
    }

    removeGame( roomName: string ) {
        console.log('REMOVE GAME')

        if (this.games[roomName]) {
            this.games[roomName].destroy()
            delete this.games[roomName]
            this.gamesUpdate[roomName].unsubscribe()
            delete this.gamesUpdate[roomName]
        }
       
    }

    async initGame(users: User[], roomName: string) {
        const spawns: Vector2[] = JSON.parse(JSON.stringify((await this.gameMapService.getShopMap()).spawnPoint))
        console.log('SPawn' , spawns)
        const game = new Game(users, roomName, spawns)
        this.games[roomName] = game
        this.gamesUpdate[roomName] = this.games[roomName].$update.subscribe((update) => {
            this.gameGateway.updateGame(roomName, update)
        })
        return game
    }

    startGame(roomName: string) {
        this.games[roomName].init()
    }
    
    setUserReady(roomName: string, userId: string): boolean {
        this.games[roomName].users[userId].isReady = true
        if (this.games[roomName].init()) {
            return true
        }
        return false
    }

    updatePlayerInput(roomName: string, userId: string, input: Partial<PlayerInput>) {
        this.games[roomName].setPlayerInputs(userId, input)
    }

    getGame(roomName: string) {
        const game = this.games[roomName]
        return {
            players: game.getPlayers(),
            map: game.actualMap
        }
    } 

}
