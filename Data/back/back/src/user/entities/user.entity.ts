import { IsBoolean, IsEmail, Matches } from "class-validator";
import { Column, Entity, PrimaryColumn, } from "typeorm";

@Entity({name: "Users"})
export class User {

    @PrimaryColumn()
    @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
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

