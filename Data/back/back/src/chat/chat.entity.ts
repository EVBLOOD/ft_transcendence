import { Message } from 'src/message/message.entity';
import { User } from 'src/user/user.entity';
import { Punishment } from 'src/chat/punishment/punishment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Message, (message: Message) => message.chatRoomId, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  message!: Message[];

  @ManyToMany(() => User, (user: User) => user.chatRoomMember, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  member!: User[];

  @ManyToOne(() => User, (user: User) => user.chatRoomOwner, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  owner!: User;

  @ManyToMany(() => User, (user: User) => user.chatRoomAdnim, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  admin!: User[];

  @Column({
    nullable: false,
    default: 'public',
  })
  type!: string; // public, private, protected, DM

  @Column({
    nullable: true,
  })
  password!: string;

  @Column({
    nullable: false,
  })
  chatRoomName!: string;

  @OneToMany(() => Punishment, (punishment: Punishment) => punishment.user)
  @JoinColumn()
  punishment!: Punishment[];
}
