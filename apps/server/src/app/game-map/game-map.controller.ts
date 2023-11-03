import { Controller, Get } from '@nestjs/common';
import { GameMapService } from './game-map.service';
import { GameMap } from './interfaces/gameMap-interface';

@Controller('game-map')
export class GameMapController {

  constructor(private readonly gameMapService: GameMapService) { }

  @Get('shop')
  async getShopMap(): Promise<GameMap> {
    return await this.gameMapService.getShopMap();
  }
}
