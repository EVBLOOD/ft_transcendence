import { Exclude } from 'class-transformer';
import { IsBoolean, Matches } from 'class-validator';
import { Messages } from 'src/chat/entities/Messages.entity';
import { Match } from 'src/match/entities/match.entity';
import { Column, Entity, OneToMany, PrimaryColumn, } from 'typeorm';

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

  // match
  @OneToMany(() => Match, match => match.player1)
  matchesAsPlayer1: Match[];

  @OneToMany(() => Match, match => match.player2)
  matchesAsPlayer2: Match[];

  @OneToMany(() => Match, match => match.winner)
  wonMatches: Match[];

  @OneToMany(() => Messages, (messages) => messages.chat_id)
  messages: Messages;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
