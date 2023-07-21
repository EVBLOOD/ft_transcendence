import { IsNotEmpty } from 'class-validator';
// import { User } from 'src/user/user.entity';

import { Chat } from 'src/chat/chat.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn({
    name: 'messageID',
  })
  id!: number;

  @Column({
    nullable: false,
  })
  @IsNotEmpty()
  value!: string;

  @ManyToOne(() => Chat, (chatRoom: Chat) => chatRoom.message)
  @JoinColumn()
  chatRoomId!: Chat;

  @ManyToOne(() => User, (user: User) => user.messages)
  @JoinColumn()
  userId!: User;
}
