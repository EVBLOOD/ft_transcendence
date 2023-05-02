import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, '42') {
    constructor(@Inject(AuthService) private readonly Auth_Service: AuthService)
    {
        super({
            clientID: process.env.FORTY_TWO_APP_UID,
            clientSecret: process.env.FORTY_TWO_APP_SECRET,
            callbackURL: process.env.FORTY_TWO_CALLBACK_URL,
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
        return (await done(null, await this.Auth_Service.validating(profile.username, profile.displayName, profile._json.email, profile._json.image.link)));
    }
}