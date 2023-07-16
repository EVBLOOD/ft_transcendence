import { IsNumber } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class CreateMatchDto {
  @IsNumber()
  player1Id: number;

  @IsNumber()
  player2Id: number;

  @IsNumber()
  winnerId: number;
}
