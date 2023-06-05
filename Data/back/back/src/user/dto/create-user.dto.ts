import { IsBoolean, IsEmail, IsNotEmpty, Matches } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
    username: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsBoolean()
    two_factor_authentication_state: boolean;

    @IsNotEmpty()
    avatar: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}
