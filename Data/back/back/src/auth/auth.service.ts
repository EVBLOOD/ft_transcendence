import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly UserRepo : Repository<User>) {}

    async validating(name: string, username: string)
    {
        // this.UserRepo.
    }
}
