import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, Matches, isNumber } from 'class-validator';
import { Match } from 'src/match/entities/match.entity';
import { Column, Entity, OneToMany, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'Users' })
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
  username: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

  @Column()
  @IsBoolean()
  TwoFAenabled: boolean;

  @Column()
  theme: number;

  @Exclude()
  @Column({ nullable: true })
  backups: string;

  @Exclude()
  @Column({ nullable: true })
  TwoFAsecret: string;

  @OneToMany(() => Match, match => match.player1)
  matchesAsPlayer1: Match[];

  @OneToMany(() => Match, match => match.player2)
  matchesAsPlayer2: Match[];

  @OneToMany(() => Match, match => match.winner)
  wonMatches: Match[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
