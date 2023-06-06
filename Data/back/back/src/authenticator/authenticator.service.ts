import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Token } from './entities/Token.entity';

@Injectable()
export class AuthenticatorService {

    constructor(@InjectRepository(User) private readonly UserRepo : Repository<User>,
        @InjectRepository(Token) private readonly TokenRepo : Repository<Token>) {}

    async validating(username: string, name: string, email : string, avatar : string) : Promise<User> | undefined
    {
        const user = await this.UserRepo.findOne({ where: {email: email} });
        if (user)
            return user;
        return (await this.UserRepo.save( { username: username, name: name, avatar: avatar, email: email, two_factor_authentication_state: false }));
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
