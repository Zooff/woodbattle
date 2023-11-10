import { User } from "../user/user.interface"
import { Room } from "./room.interface"

export interface DefaultClientMessage {
    user: User
    roomName: string
    createdAt: number
}

export interface ClientLobbyMessage extends DefaultClientMessage {
    action: 'create' | 'join' | 'leave' | 'start'
}

export interface ServerLobbyMessage {
    action: 'connect' | 'disconnect' | 'join' | 'leave' | 'error' | 'start'
    room?: Room
    error?: string
}

export interface ClientGameReadyMessage extends DefaultClientMessage {
   
}