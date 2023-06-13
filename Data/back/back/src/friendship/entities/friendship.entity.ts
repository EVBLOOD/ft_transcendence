import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { IsBoolean, IsDate, IsEnum, Matches } from 'class-validator';

@Entity({name: 'Friendship'})
export class Friendship {

    @PrimaryColumn()
    @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
    sender: string;

    @PrimaryColumn()
    @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
    receiver: string;

    @Column({ type: 'enum', enum: ['pending', 'accepted'] })
    @IsEnum({enum: ['pending', 'accepted']})
    status: string;
  
    @Column()
    @IsBoolean()
    blocked: boolean;
  
    @Column()
    @IsDate()
    created_at: Date;
    
    @Column()
    @IsDate()
    updated_at: Date;

    @Column({ type: 'enum', enum: ['sender', 'receiver'] })
    @IsEnum({enum: ['sender', 'receiver']})
    blocked_by: string;
  
    @ManyToOne(() => User)
    @JoinColumn({name: 'sender'})
    user1: User;
    
    @ManyToOne(() => User)
    @JoinColumn({name: 'receiver'})
    user2: User;
}
