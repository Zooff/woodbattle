import { Injectable } from "@angular/core";
import { ClientLobbyMessage, DefaultClientMessage, ServerGameMessage, ServerLobbyMessage } from "@woodbattle/shared/model";
import { Socket } from "ngx-socket-io";
import { UserService } from "./user.service";
import { Observable, interval, of, switchMap, tap, throwError } from "rxjs";
import { LobbyService } from "./lobby.service";

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    ping: number = 0

    latencyObs: any = null
    lastLatencyCall: number = 0

    constructor(
        private socket: Socket,
        private userService: UserService,
        private lobbyService: LobbyService
    ) {
        this.socket.on('connect', () => {
            this.userService.setSocketId(this.socket.ioSocket.id)
            console.log(this.userService.getActualUser())
            this.latencyObs = interval(5000).pipe(
                tap(() => {
                    this.lastLatencyCall = performance.now()
                    this.socket.emit('latency')
                })).subscribe()
        })
    }

    getLatency() {
        let now = performance.now()
        return this.socket.fromEvent('latency').pipe(
            switchMap(() => {
                return of(performance.now() - this.lastLatencyCall)
            })
        )
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

    leaveRoom(roomName: string) {
        const message: ClientLobbyMessage = {
            action: "leave",
            user: this.userService.getActualUser(),
            roomName: roomName,
            createdAt: Date.now()
        }
        this.socket.emit('lobby', message)
    }

    onReceiveLobbyMessage(): Observable<ServerLobbyMessage> {
        return this.socket.fromEvent('lobby')
        // return obs.pipe(
        // const obs = this.socket.fromEvent('lobby') as Observable<ServerLobbyMessage>
        // return obs.pipe(
        //     switchMap((payload: ServerLobbyMessage) => {
        //         console.log(payload)
        //         if (payload.action === 'error') {
        //             return throwError(() => new Error(payload.error))
        //         }
        //         return of(payload)
        //     })
        // )
    }

    startGame(roomName: string) {
        const message: ClientLobbyMessage = {
            action: "start",
            user: this.userService.getActualUser(),
            roomName: roomName,
            createdAt: Date.now()
        }
        this.socket.emit('lobby', message)
    }

    isReady() {
        const message: DefaultClientMessage = {
            user: this.userService.getActualUser(),
            roomName: this.lobbyService.room.name,
            createdAt: Date.now()
        }
        this.socket.emit('client-ready', message)
    }

    onReceiveGameStart(): Observable<ServerGameMessage> {
        return this.socket.fromEvent('game-start')
    }

}