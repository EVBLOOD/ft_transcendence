import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { IsBoolean, IsDate, IsEnum, Matches } from 'class-validator';

@Entity({name: 'Friendship'})
export class Friendship {

    @PrimaryColumn()
    @Matches(/^[A-Za-z-]+$/, {message: 'The value must contain only alphabets and the "-" character',} )
    user1_username: string;

    @PrimaryColumn()
    @Matches( /^[A-Za-z-]+$/, {message: 'The value must contain only alphabets and the "-" character',} )
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
    @Matches( /^[A-Za-z-]+$/, {message: 'The value must contain only alphabets and the "-" character',} )
    blocked_by: string;
  
    @ManyToOne(() => User)
    @JoinColumn({name: 'user1_username'})
    user1: User;
    
    @ManyToOne(() => User)
    @JoinColumn({name: 'user2_username'})
    user2: User;
}
