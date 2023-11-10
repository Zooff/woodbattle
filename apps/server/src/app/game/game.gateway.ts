import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Socket, Server } from 'socket.io';
import { DefaultClientMessage } from '@woodbattle/shared/model';

@WebSocketGateway()
export class GameGateway {

  @WebSocketServer() server: Server

  constructor(private gameService: GameService) {}

  @SubscribeMessage('client-ready')
  handleClientReady(client: any, payload: DefaultClientMessage) {
    if (this.gameService.setUserReady(payload.roomName, payload.user.id)) {
        this.server.to(payload.roomName).emit('game-start')
    }
  }

  sendGameInit(roomName: string) {

  }
}
