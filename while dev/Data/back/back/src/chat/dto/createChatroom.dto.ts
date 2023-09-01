import { MaxLength, IsNotEmpty } from 'class-validator';

export class createChatroomDTO {
  @IsNotEmpty()
  type!: string;

  @IsNotEmpty()
  @MaxLength(26, {
    message: 'chat name too long',
  })
  chatroomName!: string;

  password!: string;
}
