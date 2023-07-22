import { IsNotEmpty } from 'class-validator';

export class createMemberDTO {
  @IsNotEmpty()
  member!: number;

  password?: string;
}
