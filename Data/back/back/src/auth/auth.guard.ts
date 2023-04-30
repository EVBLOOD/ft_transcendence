import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { Observable } from 'rxjs';

@Injectable() 
export class MyAuthGuard extends AuthGuard('42') {

    async canActivate(context: ExecutionContext) {
        const can_activate = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return can_activate;
    }
}