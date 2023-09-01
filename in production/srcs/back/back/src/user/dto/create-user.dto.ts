import { MinLength } from 'class-validator';
import { MaxLength } from 'class-validator';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Matches(/^[a-z]+(-[a-z]+)?$/)
  @MinLength(2)
  @MaxLength(10)
  username: string;

  @MinLength(2)
  @MaxLength(20)
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
}

export class UpdateUserDto {
  @IsNotEmpty()
  @Matches(/^[a-z]+(-[a-z]+)?$/)
  @MinLength(2)
  @MaxLength(10)
  username: string;

  @MinLength(2)
  @MaxLength(20)
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty()
  twofactor: boolean;

  @IsNumber()
  theme: number;
}
