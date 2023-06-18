import { Chat } from 'src/chat/chat.entity';
import { Message } from 'src/message/message.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  // @PrimaryGeneratedColumn()
  // id!: number;

  @PrimaryColumn()
  userName!: string;

  @OneToMany(
    () => Message,
    (message: Message) => {
      message.userId;
    },
  )
  @JoinColumn()
  messages!: Message[];

  @OneToMany(() => Chat, (chatRoom: Chat) => chatRoom.member)
  @JoinColumn()
  chatRoomMember!: Chat[];

  @OneToMany(() => Chat, (chatRoom: Chat) => chatRoom.owner)
  @JoinColumn()
  chatRoomOwner!: Chat[];

  @OneToMany(() => Chat, (chatRoom: Chat) => chatRoom.admin)
  @JoinColumn()
  chatRoomAdnim!: Chat[];
}
