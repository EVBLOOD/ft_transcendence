import { IsNotEmpty } from 'class-validator';
export class createPunishmentDTO {
  @IsNotEmpty()
  type!: string;

  @IsNotEmpty()
  chatID!: number;

  @IsNotEmpty()
  user!: string;
}
