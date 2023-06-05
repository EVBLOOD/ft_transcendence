import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthenticatorService {

    constructor(@InjectRepository(User) private readonly UserRepo : Repository<User>) {}

    async validating(username: string, name: string, email : string, avatar : string) : Promise<User> | undefined
    {
        const user = await this.UserRepo.findOne({ where: {email: email} });
        if (user)
            return user;
        return (await this.UserRepo.save( { username: username, name: name, avatar: avatar, email: email, two_factor_authentication_state: false }));
    }
}
