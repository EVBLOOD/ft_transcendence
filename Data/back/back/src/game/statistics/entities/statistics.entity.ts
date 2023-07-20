
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Statastics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column()
  score: number;

  @Column()
  win: number;

  @OneToOne(() => User)
  @JoinColumn()
  User: User;
}

