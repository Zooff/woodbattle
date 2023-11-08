import { Injectable } from "@angular/core";
import { ClientLobbyMessage, ServerLobbyMessage } from "@woodbattle/shared/model";
import { Socket } from "ngx-socket-io";
import { UserService } from "./user.service";
import { Observable, tap, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    constructor(
        private socket: Socket,
        private userService: UserService
    ) {
        this.socket.on('connect', () => {
            this.userService.setSocketId(this.socket.ioSocket.id)
            console.log(this.userService.getActualUser())
        })
    }

    sendMessage() {
        this.socket.emit('message')
    }

    onReceiveMessage() {
        return this.socket.fromEvent('message')
    }

    createRoom(roomName: string) {
        const message: ClientLobbyMessage = {
            action: "create",
            user: this.userService.getActualUser(),
            roomName: roomName,
            createdAt: Date.now()
        }
        this.socket.emit('lobby', message)
    }

    joinRoom(roomName: string) {
        const message: ClientLobbyMessage = {
            action: "join",
            user: this.userService.getActualUser(),
            roomName: roomName,
            createdAt: Date.now()
        }
        this.socket.emit('lobby', message)
    }

    onReceiveLobbyMessage(): Observable<ServerLobbyMessage> {
        const obs = this.socket.fromEvent('lobby') as Observable<ServerLobbyMessage>
        return obs.pipe(
            tap((payload: ServerLobbyMessage) => {
                console.log(payload)
                if (payload.action === 'error') {
                    throwError(() => new Error(payload.error))
                }
            })
        )
    }

}