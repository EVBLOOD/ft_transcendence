import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Chat } from "./chat.entity";

@Entity('Members')
export class Members
{
    @PrimaryColumn()
    username: string;

    @PrimaryColumn()
    chatID: number;

    @Column()
    state: boolean; // active 1 - blocked 0
    
    @Column({type: 'enum', enum: ["none", "admin", "owner"]})
    role: string;


    @ManyToOne(() => User)
    @JoinColumn({name: 'username'})
    user: User;

    @ManyToOne(() => Chat)
    @JoinColumn({name: 'chatID'})
    chat: Chat;
}