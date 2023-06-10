import { Chat } from 'src/chat/chat.entity';
import { Message } from 'src/message/dto/message.dto';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @OneToMany(
    () => Message,
    (message: Message) => {
      message.userId;
    },
  )
  @JoinColumn()
  messages: Message[];

  @OneToMany(() => Chat, (chatRoom: Chat) => chatRoom.member)
  @JoinColumn()
  chatRoomMember: Chat[];

  @OneToMany(() => Chat, (chatRoom: Chat) => chatRoom.owner)
  @JoinColumn()
  chatRoomOwner: Chat[];

  @OneToMany(() => Chat, (chatRoom: Chat) => chatRoom.admin)
  @JoinColumn()
  chatRoomAdnim: Chat[];
}
