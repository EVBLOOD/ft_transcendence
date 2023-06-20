import { IsBoolean, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
  username: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsBoolean()
  TwoFAenabled: boolean;

  //   TwoFAsecret: string;
}
