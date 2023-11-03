import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameMapController } from './game-map/game-map.controller';
import { GameMapService } from './game-map/game-map.service';

@Module({
  imports: [],
  controllers: [AppController, GameMapController],
  providers: [AppService, GameMapService],
})
export class AppModule {}
