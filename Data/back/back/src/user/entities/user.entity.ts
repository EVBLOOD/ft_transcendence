import { Contains, IsBoolean, IsEmail, Matches, NotContains } from "class-validator";
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Friendship } from "src/friendship/entities/friendship.entity";

@Entity({name: "Users"})
export class User {

    @PrimaryColumn()
    @Matches(/^[A-Za-z-]+$/, {message: 'The value must contain only alphabets and the "-" character',} )
    username: string;

    @Column()
    name: string;

    @Column()
    @IsBoolean()
    two_factor_authentication_state: boolean;

    @Column()
    avatar: string;

    @Column()
    @IsEmail()
    email: string;
}

