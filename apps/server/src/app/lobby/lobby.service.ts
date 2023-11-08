import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Room, User } from '@woodbattle/shared/model';

@Injectable()
export class LobbyService {

    private rooms: Room[] = []


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
        if (index === -1) return 

        this.rooms[index].users.push(user)
        return this.rooms[index]
    }

    startGame() {

    }

    getAllRooms(): Room[] {
        return this.rooms
    }

    getRoomByName( name: string ): Room {
        return this.rooms[this.getRoomIndexByName(name)]
    }

    removeFromAllRoom(socketId: string): Room[] {
        let roomsToUpdate = []
        for (const room of this.rooms) {
            const index = room.users.findIndex((el) => el.socketId === socketId)
            if (index !== -1) {
                roomsToUpdate.concat(room.users.splice(index, 1))
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
                this.rooms.slice(i, 1)
            }
        }
    }
}
