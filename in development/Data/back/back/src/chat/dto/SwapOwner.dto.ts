import { IsNotEmpty } from 'class-validator';

export class SwapOwnerDTO {
  @IsNotEmpty()
  roleGiver!: number;
  @IsNotEmpty()
  roleReciver!: number;
}
