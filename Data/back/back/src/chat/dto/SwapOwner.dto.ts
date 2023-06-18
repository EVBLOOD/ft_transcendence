import { IsNotEmpty } from 'class-validator';

export class SwapOwnerDTO {
  @IsNotEmpty()
  roleGiver!: string;
  @IsNotEmpty()
  roleReciver!: string;
}
