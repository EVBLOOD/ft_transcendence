import { Test, TestingModule } from '@nestjs/testing';
import { CurrentStatusGateway } from './current_status.gateway';

describe('CurrentStatusGateway', () => {
  let gateway: CurrentStatusGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrentStatusGateway],
    }).compile();

    gateway = module.get<CurrentStatusGateway>(CurrentStatusGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
