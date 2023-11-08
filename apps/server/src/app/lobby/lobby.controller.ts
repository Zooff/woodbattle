import { Controller, Get, Param } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { Room } from '@woodbattle/shared/model';

@Controller('lobby')
export class LobbyController {

    constructor (private lobbyService: LobbyService) {}

    @Get('')
    getAllLobby(): Room[] {
        return this.lobbyService.getAllRooms()
    }

    @Get(':name')
    getLobbyByName(@Param('name') name: string): Room {
        return this.lobbyService.getRoomByName(name)
    }

}
