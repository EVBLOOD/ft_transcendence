import { User } from "src/user/entities/user.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Chat } from "./chat.entity";

@Entity('Members')
export class Members {
    @PrimaryColumn()
    Userid: number;

    @PrimaryColumn()
    chatID: number;

    @Column()
    state: number; // active 1 - blocked 0 - invited 2 - muted 3

    @Column({ type: 'enum', enum: ["none", "admin", "owner"] })
    role: string;

    @Column({ nullable: true })
    mute: Date; // should be the date and time when mute ends

    @Column({ nullable: true })
    notSeen: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'Userid' })
    user: User;

    @ManyToOne(() => Chat)
    @JoinColumn({ name: 'chatID' })
    chat: Chat;

    @DeleteDateColumn({ name: 'deleted_at' })
    deleted_at: Date;
}