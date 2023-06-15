import { IsNotEmpty } from 'class-validator';

export class createAdminDTO {
  @IsNotEmpty()
  roleGiver!: number;

  @IsNotEmpty()
  roleReceiver!: number;
}
