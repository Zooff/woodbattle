import { PlayerInput } from "../game/playerInput.interface"
import { User } from "../user/user.interface"
import { GameObject } from "../utils/game-object.interface"
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

export interface ServerGameMessage {
    action: 'init-game' | 'update-game' | 'update-map' | 'end-game'
    playerCharacters: {[id: string]: GameObject}
    actualMap: string
}

export interface ClientInputMessage extends DefaultClientMessage {
    playerInput: Partial<PlayerInput>
}