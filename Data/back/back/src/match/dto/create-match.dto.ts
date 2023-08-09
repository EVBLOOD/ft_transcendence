import { IsNumber } from "class-validator";

export class CreateMatchDto {
  @IsNumber()
  player1Id: number;

  @IsNumber()
  player2Id: number;

  @IsNumber()
  winnerId: number;
}
