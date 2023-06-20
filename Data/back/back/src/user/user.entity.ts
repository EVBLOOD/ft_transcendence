import { Chat } from 'src/chat/chat.entity';
import { Message } from 'src/message/message.entity';
import {
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  PrimaryColumn,
  ManyToMany,
} from 'typeorm';

@Entity()
export class User {
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

  @ManyToMany(() => Chat, (chatRoom: Chat) => chatRoom.member)
  @JoinTable()
  chatRoomMember!: Chat[];

  @OneToMany(() => Chat, (chatRoom: Chat) => chatRoom.owner)
  @JoinColumn()
  chatRoomOwner!: Chat[];

  @ManyToMany(() => Chat, (chatRoom: Chat) => chatRoom.admin)
  @JoinTable()
  chatRoomAdnim!: Chat[];
}
