import { IsNotEmpty } from 'class-validator';

export class createMemberDTO {
  @IsNotEmpty()
  member!: string;

  password?: string;
}
