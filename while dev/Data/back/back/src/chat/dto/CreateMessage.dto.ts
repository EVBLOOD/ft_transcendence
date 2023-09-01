import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateMessage {

    @IsNotEmpty()
    @MinLength(1, {
        message: "Message can't be empty",
    })
    @MaxLength(500, {
        message: 'Message too long',
    })
    value!: string;

    @IsNotEmpty()
    charRoomId!: number;

}
