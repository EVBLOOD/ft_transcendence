import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "./chat.entity";

@Entity('messages')
export class Messages {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column()
    time: Date;
    
    @ManyToOne(() => User, (user) => user.username)
    @JoinColumn({name: 'sender_username'})
    username: string;
    
    @ManyToOne(() => Chat, (chat) => chat.id)
    @JoinColumn({name: 'part_of_chat_id'})
    chat_id: number;
}