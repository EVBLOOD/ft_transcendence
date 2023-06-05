import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatorService } from './authenticator.service';

describe('AuthenticatorService', () => {
  let service: AuthenticatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthenticatorService],
    }).compile();

    service = module.get<AuthenticatorService>(AuthenticatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
