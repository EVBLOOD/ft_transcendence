import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";

@Injectable() 
export class MyAuthGuard extends AuthGuard('42') {

    async canActivate(context: ExecutionContext) {
        try {
            const can_activate = (await super.canActivate(context)) as boolean;
            if (can_activate == false)
                return false;
        }
        catch (error)
        {
            throw new UnauthorizedException();
        }
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return true;
    }
}