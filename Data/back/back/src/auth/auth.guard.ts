import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";

@Injectable() 
export class MyAuthGuard extends AuthGuard('42') {
  async canActivate(context: ExecutionContext) {
    const act = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return act;
  }
}