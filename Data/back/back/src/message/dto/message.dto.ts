import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class Message {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @MinLength(1, {
    message: "Message can't be empty",
  })
  @MaxLength(500, {
    message: 'Message too long',
  })
  value: string;

  @IsNotEmpty()
  charRoomId: number;
}
