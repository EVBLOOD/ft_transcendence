import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/user.entity';
import { Chat } from 'src/chat/chat.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn({
    name: 'messageID',
  })
  id: number;

  @Column({
    nullable: false,
  })
  @IsNotEmpty()
  value: string;

  @ManyToOne(() => Chat, (chatRoom: Chat) => chatRoom.message)
  chatRoomId: Chat;

  @ManyToOne(() => User, (user: User) => user.messages)
  userId: User;
}
