import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket, Server } from 'socket.io';
import { DefaultClientMessage, ServerGameMessage } from '@woodbattle/shared/model';

@WebSocketGateway()
export class GameGateway {

  @WebSocketServer() server: Server

  constructor(private gameService: GameService) {}

  @SubscribeMessage('client-ready')
  handleClientReady(client: any, payload: DefaultClientMessage) {
    if (this.gameService.setUserReady(payload.roomName, payload.user.id)) {
        const game = this.gameService.getGame(payload.roomName)
        const serverPayload: ServerGameMessage = {
          action: 'init-game',
          playerCharacters: game.players,
          actualMap: game.map
        }
        this.server.to(payload.roomName).emit('game-start', serverPayload)
    }
  }

  sendGameInit(roomName: string) {

  }
}
