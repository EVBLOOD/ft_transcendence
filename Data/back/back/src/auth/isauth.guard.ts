import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class IsauthGuard implements CanActivate {
  canActivate( context: ExecutionContext )
  {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}
