import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Token {
    @PrimaryColumn()
    token: string;

    @Column()
    expiration_date: Date;

    @OneToOne(() => User)
    @JoinColumn()
    User: User;
}