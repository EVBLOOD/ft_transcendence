import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Token } from './entities/Token.entity';
import * as speakeasy from "speakeasy";
import * as qrcode from "qrcode";
import * as crypto from "crypto";
import * as bcrypt from "bcrypt";


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
    
    async TwoFactoRequired(username: string)
    {
        const user = await this.UserRepo.findOne( { where: {username: username} } );
        if (!user || !user.TwoFAenabled)
            return false;
        return true;
    }

    async TwoFA_SendQr(username: string)
    {
        const user = await this.UserRepo.findOne( { where: {username: username} } );
        if (!user || user.TwoFAenabled)
            return null;
        var result : any;
        try{
            const secret = await speakeasy.generateSecret();
            result = await qrcode.toDataURL(secret.otpauth_url);
            console.log(result);
            if (result)
                await this.UserRepo.save(
                    { username:username,
                      name: user.name,
                      avatar: user.avatar,
                      email: user.email,
                      TwoFAenabled: false,
                      TwoFAsecret: secret.base32 });
        }
        catch (err)
        {
            return null;
        }
        return result;
    }
    
    async checkbackups(list: string, entered: string)
    {
        if (list.length == 0)
            return null;
            const listing : string[] = list.split(';');
        for (let i : number = 0; i < listing.length; i++)
        {
            if (await bcrypt.compare(entered, listing[i]))
            {
                let end = "";
                for (let j = 0; j < listing.length - 1; j++)
                {
                    if (i != j)
                        end += listing[j] + ";";
                }
                return end;
            }
        }
        return null;
    }

    async TwoFA_Validate(username: string, token: string)
    {
        const user = await this.UserRepo.findOne( { where: {username: username} } );
        if (!user || !user.TwoFAenabled)
            return null;
        const tok = await this.TokenRepo.findOne( { where: {User: user} } );
        if (!tok)
            return null;
       const verify = await speakeasy.totp.verify({secret: user.TwoFAsecret, encoding: 'base32', token: token});
       if (!verify)
       {
           const ret = await this.checkbackups(user.backups, token);
           if (ret != null)
           {
               const tok = await this.TokenRepo.findOne( { where: {User: user} } );
               await this.TokenRepo.save({token: tok.token,loggedIn: true});
               return await this.UserRepo.save(
                   { username:username, backups: ret});
            }
            return null;
        }
        await this.TokenRepo.save({token: tok.token,loggedIn: true});
       return user;
    }

    async hashing(backups : number[], salt : string)
    {
        let ret : string = "";
        for (let i : number = 0; i < backups.length; i++)
            ret += await bcrypt.hash(backups[i].toString(), salt) + ";";
        return ret;
    }

    async TwoFA_Enabling(username: string, token: string)
    {
        const user = await this.UserRepo.findOne( { where: {username: username} } );
        if (!user || user.TwoFAenabled || user.TwoFAsecret == "")
            return null;
        const verify = await speakeasy.totp.verify({secret: user.TwoFAsecret, encoding: 'base32', token: token});
        if (!verify)
            return null;
        const secret : string = user.TwoFAsecret;
        let backups = [];
        for (let i : number = 0; i < 6; i++)
            backups.push(crypto.randomInt(100000, 999999));
        const salt = await bcrypt.genSalt();
        const tostore = await this.hashing(backups, salt);
        return {user: await this.UserRepo.save(
            { username:username,
              name: user.name,
              avatar: user.avatar,
              email: user.email,
              TwoFAenabled: true,
              TwoFAsecret: user.TwoFAsecret, backups: tostore}), backups: backups};
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
            if (user.TwoFAenabled)
                return await this.TokenRepo.save({token: new_token, expiration_date: time.toISOString(), loggedIn: false, User: user });
            return await this.TokenRepo.save({token: new_token, expiration_date: time.toISOString(), loggedIn: true, User: user });
        }
        if (new_token != token[0].token || time.toISOString() >= token[0].expiration_date.toISOString()) {
            time.setDate(time.getDate() + 7); 
            await this.TokenRepo.delete(token[0]);
            if (user.TwoFAenabled)
                return await this.TokenRepo.save({token: new_token, expiration_date: time.toISOString(), loggedIn: false, User: user });
            return await this.TokenRepo.save({token: new_token, expiration_date: time.toISOString(), loggedIn: true, User: user });
        }
        return token[0];
    }
    async IsSame(username: string, token: string)
    {
        const TokenUSer = await this.TokenRepo.findOne({where: {token: token}, relations: {User: true}}, );
        if (!TokenUSer)
            return false;
        if (TokenUSer.User.TwoFAenabled && TokenUSer.loggedIn == false)
            return false;
        const time = new Date();
        if (TokenUSer.token == token && time.toISOString() < TokenUSer.expiration_date.toISOString() && TokenUSer.User.username == username)
            return true;
        return false;
    }

    async IsSameBut(username: string, token: string)
    {
        const TokenUSer = await this.TokenRepo.findOne({where: {token: token}, relations: {User: true}}, );
        if (!TokenUSer)
            return false;
        if (TokenUSer.User.TwoFAenabled == true && TokenUSer.loggedIn == false)
            return {TFA: TokenUSer.User}
        const time = new Date();
        if (TokenUSer.token == token && time.toISOString() < TokenUSer.expiration_date.toISOString() && TokenUSer.User.username == username)
            return true;
        return false;
    }
}
