import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { IsBoolean, IsDate, IsEnum, Matches } from 'class-validator';

@Entity({name: 'Friendship'})
export class Friendship {

    @PrimaryColumn()
    @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
    user1_username: string;

    @PrimaryColumn()
    @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
    user2_username: string;

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

    @Column()
    @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
    blocked_by: string;
  
    @ManyToOne(() => User)
    @JoinColumn({name: 'user1_username'})
    user1: User;
    
    @ManyToOne(() => User)
    @JoinColumn({name: 'user2_username'})
    user2: User;
}
