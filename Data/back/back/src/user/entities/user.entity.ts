import { IsBoolean, IsEmail, Matches } from "class-validator";
// import { Messages } from "src/chat/entities/Messages.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, } from "typeorm";

@Entity({name: "Users"})
export class User {

    @PrimaryColumn()
    @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
    username: string;

    @Column()
    name: string;

    @Column()
    avatar: string;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    @IsBoolean()
    TwoFAenabled: boolean;
    
    @Column({ nullable: true })
    backups: string;

    @Column({nullable: true})
    salt: string;

    @Column({nullable: true})
    TwoFAsecret: string;
}

