import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Chat } from "../chat.entity";

@Entity()
export class Punishment {

	@PrimaryGeneratedColumn({
		name: "punishmentID",
	})
	id! : number;

	@CreateDateColumn()
	time!: Date;

	@Column({
		nullable: false,
	})
	PunishmentType!: string;

	@ManyToOne(() => User, (user: User)=> user.punishment, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	user!: User;

	@ManyToOne(() => Chat, (chat: Chat) => chat.punishment, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	chat!: Chat;
}
