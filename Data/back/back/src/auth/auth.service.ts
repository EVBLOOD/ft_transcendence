import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly UserRepo : Repository<User>) {}

    async validating(username: string, name: string) : Promise<User> | undefined
    {
        const user = await this.UserRepo.findOne({ where: {username: username} });
        console.log("__wild stuff__");
        if (user)
            return user;
        console.log("wild stuff");
        return (await this.UserRepo.save({username: username, name: name }));
    }
}
