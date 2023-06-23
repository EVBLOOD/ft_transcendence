
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.matchesAsPlayer1)
  player1: User;

  @ManyToOne(() => User, user => user.matchesAsPlayer2)
  player2: User;

  @ManyToOne(() => User, user => user.wonMatches)
  winner: User;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  date: Date;
}

