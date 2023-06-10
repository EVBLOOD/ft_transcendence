import { Message } from 'src/message/message.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    default: 'public',
  })
  type: string; // public, private, protected

  @Column({
    nullable: true,
  })
  password: string;

  @Column({
    nullable: false,
  })
  chatRoomName: string;

  @OneToMany(() => Message, (message: Message) => message.chatRoomId)
  @JoinColumn()
  message: Message[];

  @OneToMany(() => User, (user: User) => user.chatRoomMember)
  @JoinColumn()
  member: User[];

  @OneToMany(() => User, (user: User) => user.chatRoomOwner)
  @JoinColumn()
  owner: User;

  @OneToMany(() => User, (user: User) => user.chatRoomAdnim)
  @JoinColumn()
  admin: User[];
}
