import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/user.entity';
import { Chat } from 'src/chat/chat.entity';

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
  charRoomId: Chat;

  @ManyToOne(() => User, (user: User) => user.messages)
  userId: User;
}
