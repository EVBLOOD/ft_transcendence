import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatorController } from './authenticator.controller';
import { AuthenticatorService } from './authenticator.service';

describe('AuthenticatorController', () => {
  let controller: AuthenticatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticatorController],
      providers: [AuthenticatorService],
    }).compile();

    controller = module.get<AuthenticatorController>(AuthenticatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
