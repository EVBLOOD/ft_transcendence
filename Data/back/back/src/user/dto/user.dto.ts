import { IsNotEmpty } from 'class-validator';

export class createUserDTO {
  @IsNotEmpty()
  userName!: string;
}
