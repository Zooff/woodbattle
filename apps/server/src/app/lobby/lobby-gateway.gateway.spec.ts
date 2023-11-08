import { Test, TestingModule } from '@nestjs/testing';
import { LobbyGatewayGateway } from './lobby-gateway.gateway';

describe('LobbyGatewayGateway', () => {
  let gateway: LobbyGatewayGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LobbyGatewayGateway],
    }).compile();

    gateway = module.get<LobbyGatewayGateway>(LobbyGatewayGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
