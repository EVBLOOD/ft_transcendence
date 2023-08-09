import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, Matches, isNumber } from 'class-validator';
import { Chat } from 'src/chat/chat.entity';
import { Punishment } from 'src/chat/punishment/punishment.entity';
import { ReadUserMessages } from 'src/chat/readMessages.entity';
import { Match } from 'src/match/entities/match.entity';
import { Message } from 'src/message/message.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';

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
  @OneToMany(() => Match, (match) => match.player1)
  matchesAsPlayer1: Match[];

  @OneToMany(() => Match, (match) => match.player2)
  matchesAsPlayer2: Match[];

  @OneToMany(() => Match, (match) => match.winner)
  wonMatches: Match[];

  // chat
  @OneToMany(
    () => Message,
    (message: Message) => {
      message.userId;
    },
  )
  @JoinColumn()
  messages!: Message[];

  @ManyToMany(() => Chat, (chatRoom: Chat) => chatRoom.member)
  @JoinTable()
  chatRoomMember!: Chat[];

  @OneToMany(() => Chat, (chatRoom: Chat) => chatRoom.owner)
  @JoinColumn()
  chatRoomOwner!: Chat[];

  @ManyToMany(() => Chat, (chatRoom: Chat) => chatRoom.admin)
  @JoinTable()
  chatRoomAdnim!: Chat[];

  @OneToMany(() => Punishment, (punishment: Punishment) => punishment.user)
  @JoinColumn()
  punishment!: Punishment[];

  @OneToMany(() => ReadUserMessages, (status) => status.user)
  userChatroomMessageStatuses: ReadUserMessages[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
