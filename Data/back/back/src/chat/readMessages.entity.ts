import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './chat.entity';

@Entity()
export class ReadUserMessages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 0,
  })
  numberOfUnreadMessages: number;

  @ManyToOne(() => User, (user: User) => user.id)
  user: User;

  @ManyToOne(() => Chat, (chatroom) => chatroom.MessageStatuses)
  chatroom: Chat;
}
