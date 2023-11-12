import { OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { LobbyService } from './lobby.service';
import { ClientLobbyMessage, Room, ServerLobbyMessage } from '@woodbattle/shared/model';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class LobbyGatewayGateway implements OnGatewayDisconnect {

  @WebSocketServer() server: Server

  constructor(private lobbyService: LobbyService) { }

  @SubscribeMessage('latency')
  handleMessage(client: any, payload: any) {
    this.server.to(client.id).emit('latency', 'pong')
  }

  @SubscribeMessage('lobby')
  async handleLobbyEvent(client: Socket, payload: ClientLobbyMessage) {
    let room
    let serverPayload: ServerLobbyMessage
    console.log(payload)
    try {
      switch (payload.action) {
        case 'create':
          room = this.lobbyService.createNewRoom(payload.roomName, payload.user)
          serverPayload = {
            action: 'connect',
            room: room
          }
          this.server.in(client.id).socketsJoin(room.name)
          break
        case 'join':
          room = this.lobbyService.joinRoom(payload.roomName, payload.user)
          serverPayload = {
            action: 'join',
            room: room
          }
          this.server.in(client.id).socketsJoin(room.name)
          break
        case 'leave':
          room = this.lobbyService.leaveRoom(payload.roomName, client.id)
          serverPayload = {
            action: 'leave',
            room: room
          }

          this.server.in(client.id).socketsLeave(room.name)
          this.server.to(client.id).emit('lobby', { action: 'disconnect' })
          break
        case 'start': {
          room = await this.lobbyService.startGame(payload.roomName, payload.user.id)
          serverPayload = {
            action: 'start',
            room: room
          }
          break;
        }
        default:
          throw 'NO_PERMITTED_ACTION'
      }

      this.server.to(payload.roomName).emit('lobby', serverPayload)

    }
    catch (err) {
      console.log('Error ', err)
      serverPayload = {
        action: 'error',
        error: err
      }

      this.server.to(client.id).emit('lobby', serverPayload)
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
    console.log(rooms)
    for (const room of rooms) {
      this.sendDisconnect(room)
    }
  }

}
