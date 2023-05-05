import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Messages } from "./Messages.entity";

@Entity('Chat')
export class Chat {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: ['direct', 'public', 'private', 'protected'] })
    type: string;

    @Column()
    password: string;

    @OneToMany( () => Messages, (messages) => messages.chat_id)
    messages: Messages;
}


/*
• The user should be able to create channels (chat rooms) that can be either public,
or private, or protected by a password.
• The user should be able to send direct messages to other users.
• The user should be able to block other users. This way, they will see no more
messages from the account they blocked.
• The user who has created a new channel is automatically set as the channel owner
until they leave it.
◦ The channel owner can set a password required to access the channel, change
it, and also remove it.
◦ The channel owner is a channel administrator. They can set other users as
administrators.
◦ A user who is an administrator of a channel can kick, ban or mute (for a
limited time) other users, but not the channel owners.
• The user should be able to invite other users to play a Pong game through the chat
interface.
• The user should be able to access other players profiles through the chat interface.
*/