import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameMapController } from './game-map/game-map.controller';
import { GameMapService } from './game-map/game-map.service';
import { LobbyGatewayGateway } from './lobby/lobby-gateway.gateway';
import { LobbyController } from './lobby/lobby.controller';
import { LobbyService } from './lobby/lobby.service';
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    ScheduleModule.forRoot()
  ],
  controllers: [AppController, GameMapController, LobbyController],
  providers: [
    AppService,
    GameMapService,
    LobbyGatewayGateway,
    LobbyService,
  ],
})
export class AppModule {}
