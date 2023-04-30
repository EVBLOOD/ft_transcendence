import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({name: "Users"})
export class User {
    @PrimaryColumn()
    username: string;

    @Column()
    name: string;
}
