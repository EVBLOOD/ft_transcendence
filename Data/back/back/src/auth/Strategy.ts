import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, '42') {
    constructor()
    {
        super({
            clientID: process.env.FORTY_TWO_APP_UID,
            clientSecret: process.env.FORTY_TWO_APP_SECRET,
            callbackURL: process.env.FORTY_TWO_CALLBACK_URL,
            // scope:  ['profile'],
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        // console.log(cb);
    }
}