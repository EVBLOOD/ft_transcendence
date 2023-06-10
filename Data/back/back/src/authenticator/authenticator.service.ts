import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Token } from './entities/Token.entity';
import * as speakeasy from "speakeasy";
import * as qrcode from "qrcode";


@Injectable()
export class AuthenticatorService {

    constructor(@InjectRepository(User) private readonly UserRepo : Repository<User>,
        @InjectRepository(Token) private readonly TokenRepo : Repository<Token>) {}

    
    async TwoFA_Disable(username: string)
    {
        const user = await this.UserRepo.findOne( { where: {username: username} } );
        if (!user || !user.TwoFAenabled)
            return null;
        return await this.UserRepo.save(
            { username:username,
              name: user.name,
              avatar: user.avatar,
              email: user.email,
              TwoFAenabled: false,
              TwoFAsecret: "" });
    }

    async TwoFA_SendQr(username: string)
    {
        const user = await this.UserRepo.findOne( { where: {username: username} } );
        if (!user || user.TwoFAenabled)
            return null;
        const secret = speakeasy.generateSecret();
        let result;
        qrcode.ToDataUrl(secret.otpauth_url, (err, url) => {
            if (err)
            {
                console.log("err");
                result = null;
                return ;
            }
            console.log("qr link pass");
            result = {qr: url, secert: secret};
        });
        return secret;
    }
    
    async TwoFA_Validate(username: string, token: number)
    {
        const user = await this.UserRepo.findOne( { where: {username: username} } );
        if (!user || !user.TwoFAenabled)
            return null;
        const verify = speakeasy.totp.verify({secert: user.TwoFAsecret, encoding: 'base32', token: token});
        if (!verify)
            return null;
        return user;
    }

    async TwoFA_Enabling(username: string, token: number, secert: any)
    {
        const verify = speakeasy.totp.verify({secert: secert.base32, encoding: 'base32', token: token});
        if (!verify)
            return null;
        const user = await this.UserRepo.findOne( { where: {username: username} } );
        if (!user)
            return null;
        return await this.UserRepo.save(
            { username:username,
              name: user.name,
              avatar: user.avatar,
              email: user.email,
              TwoFAenabled: true,
              TwoFAsecret: secert.base32 });
    }
    
    async validating(username: string, name: string, email : string, avatar : string) : Promise<User> | undefined
    {
        const user = await this.UserRepo.findOne({ where: {email: email} });
        if (user)
            return user;
        return (await this.UserRepo.save( { username: username, name: name, avatar: avatar, email: email, TwoFAenabled: false, TwoFAsecret: "" }));
    }
    async GenToken(username: string, new_token: string)
    {
        var time = new Date();
        const user = await this.UserRepo.findOne( { where: {username: username} } );
        if (!user)
            return null;
        const token = await this.TokenRepo.find( {where:[{token: new_token}, {User: user}], relations: {User: true}} );
        if (token.length > 1)
            return null;
        if (!token || token.length == 0) {
            time.setDate(time.getDate() + 7); 
            return await this.TokenRepo.save({token: new_token, expiration_date: time.toISOString(), User: user });
        }
        if (new_token != token[0].token || time.toISOString() >= token[0].expiration_date.toISOString()) {
            time.setDate(time.getDate() + 7); 
            await this.TokenRepo.delete(token[0]);
            return await this.TokenRepo.save({token: new_token, expiration_date: time.toISOString(), User: user });
        }
        return token[0];
    }
    async IsSame(username: string, token: string)
    {
        const TokenUSer = await this.TokenRepo.findOne({where: {token: token}, relations: {User: true}}, );
        if (!TokenUSer)
            return false;
        const time = new Date();
        if (TokenUSer.token == token && time.toISOString() < TokenUSer.expiration_date.toISOString() && TokenUSer.User.username == username)
            return true;
        return false;
    }
}
