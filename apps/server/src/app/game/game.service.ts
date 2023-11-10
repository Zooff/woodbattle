import { Injectable } from '@nestjs/common';
import { Game } from '@woodbattle/server'
import { User } from '@woodbattle/shared/model';

@Injectable()
export class GameService {


    private games: {[id: string]: Game} = {}

    constructor() {}

    getAllGames() {
        return this.games
    }

    removeGame( roomName: string ) {
        delete this.games[roomName]
    }

    initGame(users: User[], roomName: string) {
        const game = new Game(users, roomName)
        this.games[roomName] = game
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

    getGame(roomName: string) {
        const game = this.games[roomName]
        return {
            players: game.getPlayers(),
            map: game.actualMap
        }
    } 

}
