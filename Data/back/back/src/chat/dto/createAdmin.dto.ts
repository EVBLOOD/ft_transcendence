import { IsNotEmpty } from 'class-validator';

export class createAdminDTO {
  @IsNotEmpty()
  roleGiver!: number;

  @IsNotEmpty()
  roleReceiver!: number;
}

export class invitesDTO {
  @IsNotEmpty()
  chatID: number;

  @IsNotEmpty()
  UserId: number;
}
export class CreateBanDTO {
  @IsNotEmpty()
  chatID: number;

  @IsNotEmpty()
  UserId: number;
}
