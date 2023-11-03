import { Controller, Get } from '@nestjs/common';
import { GameMapService } from './game-map.service';
import { GameMap } from '@woodbattle/shared/model';


@Controller('game-map')
export class GameMapController {

  constructor(private readonly gameMapService: GameMapService) { }

  @Get('shop')
  async getShopMap(): Promise<GameMap> {
    return await this.gameMapService.getShopMap();
  }
}
