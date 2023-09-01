import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class fortytwoAuthGuard extends AuthGuard('42') { }