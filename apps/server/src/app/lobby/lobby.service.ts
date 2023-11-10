import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Room, User } from '@woodbattle/shared/model';
import { GameService } from '../game/game.service';

@Injectable()
export class LobbyService {

    private rooms: Room[] = []

    constructor(private gameService: GameService) {}

    createNewRoom(name: string, user: User): Room {
        if (this.getRoomIndexByName(name) !== -1) throw 'ROOM_ALREADY_EXIST'

        const room: Room = {
            id: Date.now() + 'game-room',
            name: name,
            host: user,
            users: [user],
            hasStarted: false,
            createdAt: Date.now()
        }

        this.rooms.push(room)
        return room
    }

    joinRoom(name: string, user: User): Room {
        const index = this.getRoomIndexByName(name)
        if (index === -1) throw 'ROOM_DO_NOT_EXIST'
        
        if (this.rooms[index].hasStarted) throw 'GAME_ALREADY_START'

        this.rooms[index].users.push(user)
        return this.rooms[index]
    }

    startGame(name: string, socketId: string) {
        const room = this.getRoomByName(name)

        if (socketId !== room.host.socketId) throw 'PLAYER_NOT_HOST'

        if (room.hasStarted) throw 'GAME_ALREADY_START'

        room.hasStarted = true
        this.gameService.initGame(room.users, room.name)

        return room

    }

    getAllRooms(): Room[] {
        return this.rooms
    }

    getRoomByName( name: string ): Room {
        return this.rooms[this.getRoomIndexByName(name)]
    }

    leaveRoom(roomName: string, socketId: string): Room {
        const room = this.getRoomByName(roomName)

        if (!room) throw 'ROOM_DO_NOT_EXIST'

        const index = room.users.findIndex((el) => el.socketId === socketId)
        room.users.splice(index, 1)

        if (room.users.length === 0 ) {
            this.removeRoomFromName(room.name)
        }

        else if (room.host.socketId === socketId) {
            room.host = room.users[0]
        }

        return room
        
    }

    removeRoomFromName(roomName: string) {
        this.gameService.removeGame(roomName)
        this.rooms.splice(this.getRoomIndexByName(roomName), 1)
    }

    removeFromAllRoom(socketId: string): Room[] {
        let roomsToUpdate = []
        for (const room of this.rooms) {
            const index = room.users.findIndex((el) => el.socketId === socketId)
            if (index !== -1) {
    
                if (room.host.socketId ===  room.users.splice(index, 1)[0].socketId) {
                    if (room.users.length >= 1) {
                        room.host = room.users[0]
                    }
                    else {
                        this.removeRoomFromName(room.name)
                    }
                }
                roomsToUpdate.push(room)
            }
        }

        return roomsToUpdate
    }

    private getRoomIndexByName(name: string): number {
        return this.rooms.findIndex((r) => r.name === name)
    }

    @Cron('5 * * * *')
    private clearRoom() {
        for (let i = this.rooms.length - 1; i >= 0; i--) {
            if (this.rooms[i].users.length === 0) {
                this.gameService.removeGame(this.rooms[i].name)
                this.rooms.slice(i, 1)
               
            }
        }
    }
}
