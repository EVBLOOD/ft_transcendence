import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Messages } from "./Messages.entity";

@Entity('Chat')
export class Chat {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  name: string;

  @Column({ type: 'enum', enum: ['direct', 'public', 'private', 'protected'] })
  type: string;

  @Column()
  password: string;

  @OneToMany(() => Messages, (messages) => messages.chat_id)
  messages: Messages;
}
