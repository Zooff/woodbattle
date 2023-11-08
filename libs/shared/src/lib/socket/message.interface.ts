import { User } from "../user/user.interface"
import { Room } from "./room.interface"

export interface ClientLobbyMessage {

    action: 'create' | 'join' | 'disconnect'
    user: User
    roomName: string
    createdAt: number
}

export interface ServerLobbyMessage {
    action: 'connect' | 'disconnect' | 'join' | 'leave' | 'error'
    room?: Room
    error?: string
}