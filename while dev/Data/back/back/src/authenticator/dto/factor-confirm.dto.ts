import { IsBoolean, IsEmail, IsNotEmpty, Matches } from "class-validator";


export class FactorConfirmDTO {
    @IsNotEmpty()
    @Matches(/^[0-9]*$/)
    token: string;
}
export class validateConfirmDTO {

    @IsNotEmpty()
    @Matches(/^[0-9]*$/)
    token: string;
}
