import { IsBoolean, IsEmail, IsNotEmpty, Matches } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    @Matches(/^[A-Za-z-]+$/, {message: 'The value must contain only alphabets and the "-" character',} )
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
