import { IsNotEmpty } from 'class-validator';

export class createAdminDTO {
  @IsNotEmpty()
  roleGiver!: string;

  @IsNotEmpty()
  roleReceiver!: string;
}
