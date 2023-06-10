import { IsBoolean, IsEmail, IsNotEmpty, Matches } from "class-validator";


export class FactorConfirmDTO {
    @IsNotEmpty()
    @Matches(/^[0-9]*$/)
    token: string;
}
export class validateConfirmDTO {

    @IsNotEmpty()
    @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
    username: string;

    @IsNotEmpty()
    @Matches(/^[0-9]*$/)
    token: string;
}
