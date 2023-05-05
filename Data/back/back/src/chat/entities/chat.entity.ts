import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Messages } from "./Messages.entity";
@Entity('Chat')
export class Chat {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    password: string;

    @ManyToMany(() => User)
    @JoinTable({name: "owners"})
    owner: User;
    
    
    @ManyToMany(() => User)
    @JoinTable({name: "members"})
    member: User;
    
    @ManyToMany(() => User)
    @JoinTable({name: "admins"})
    admins: User;

    @OneToMany( () => Messages, (messages) => messages.chat_id)
    messages: Messages;
}
