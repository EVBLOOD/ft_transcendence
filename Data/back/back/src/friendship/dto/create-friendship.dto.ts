import {
  IsAlpha,
  IsBoolean,
  IsDate,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Matches,
} from 'class-validator';

export class CreateFriendshipDto {
  // @IsNotEmpty()
  // @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
  // user1_username: string;

  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
  user2_username: string;

  @IsEnum({ enum: ['pending', 'accepted'] })
  status: string;

  @IsBoolean()
  blocked: boolean;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
  blocked_by: string;
}

export class DealingWithRequestDto {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
  Userone: string;

  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
  Usertwo: string;
}

export class UserValidatingDto {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
  Userone: string;
}


export class UserIdValidatingDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}