import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameMapController } from './game-map/game-map.controller';
import { GameMapService } from './game-map/game-map.service';
import { LobbyGatewayGateway } from './lobby/lobby-gateway.gateway';
import { LobbyController } from './lobby/lobby.controller';
import { LobbyService } from './lobby/lobby.service';
import { ScheduleModule } from '@nestjs/schedule';
import { GameGateway } from './game/game.gateway';
import { GameService } from './game/game.service';
import { GameController } from './game/game.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [
    AppController,
    GameMapController,
    LobbyController,
    GameController,
  ],
  providers: [
    AppService,
    GameMapService,
    LobbyGatewayGateway,
    LobbyService,
    GameGateway,
    GameService,
  ],
})
export class AppModule {}
