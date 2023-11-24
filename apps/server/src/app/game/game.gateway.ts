import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket, Server } from 'socket.io';
import { ClientInputMessage, DefaultClientMessage, ServerGameMessage } from '@woodbattle/shared/model';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway()
export class GameGateway {

  @WebSocketServer() server: Server

  constructor(
    @Inject(forwardRef(() => GameService))
    private gameService: GameService) {}

  @SubscribeMessage('client-ready')
  handleClientReady(client: any, payload: DefaultClientMessage) {
    if (this.gameService.setUserReady(payload.roomName, payload.user.id)) {
        const game = this.gameService.getGame(payload.roomName)
        const serverPayload: ServerGameMessage = {
          action: 'init-game',
          playerCharacters: game.players,
          gameObjects: game.gameObjects,
          actualMap: game.map
        }
        this.server.to(payload.roomName).emit('game-start', serverPayload)
    }
  }

  @SubscribeMessage('client-input-update')
  handleClientInput(client: any, payload: ClientInputMessage) {
    this.gameService.updatePlayerInput(payload.roomName, payload.user.id, payload.playerInput)
  }

  
  updateGame(roomName: string, update: any) {
    const serverPayload: ServerGameMessage = {
      action: update.action,
      playerCharacters: update.playerCharacters,
      gameObjects: update.gameObjects,
      actualMap: update.map
    }
    this.server.to(roomName).emit('game-update', serverPayload)
  }
}