import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { LobbyService } from './lobby.service';
import { ClientLobbyMessage, Room, ServerLobbyMessage } from '@woodbattle/shared/model';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({cors: true})
export class LobbyGatewayGateway implements OnGatewayDisconnect {

  @WebSocketServer() server: Server

  constructor(private lobbyService: LobbyService) {}

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log('Connection Ok')
    this.server.emit('message', 'Hello world')
  }

  @SubscribeMessage('lobby')
  handleLobbyEvent(client: any, payload: ClientLobbyMessage) {
    let room
    let serverPayload: ServerLobbyMessage
    console.log(payload)
    try {
      if (payload.action === 'create') {
        room = this.lobbyService.createNewRoom(payload.roomName, payload.user)
      }
      else if (payload.action === 'join') {
        room = this.lobbyService.joinRoom(payload.roomName, payload.user)
      }
  
      if (!room) {
        serverPayload = {
          action: 'error',
          error: 'Unknow Error'
        }
      }

      serverPayload = {
        action: 'connect',
        room: room
      }
      this.server.socketsJoin(room.name)
    }
    catch (err) {  
      serverPayload = {
        action: 'error',
        error: err
      }
    }
    finally {
      console.log(serverPayload)
      this.server.emit('lobby', serverPayload)
    }
    
  }

  sendDisconnect(room: Room) {
    const payload: ServerLobbyMessage = {
      action: 'leave',
      room: room
    }

    this.server.to(room.name).emit('lobby', payload)
  }

  handleDisconnect(socket: Socket) {
    console.log(socket.id)
    const rooms = this.lobbyService.removeFromAllRoom(socket.id)
    for (const room of rooms) {
      this.sendDisconnect(room)
    }
  }

}
