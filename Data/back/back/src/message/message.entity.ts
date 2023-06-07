import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty } from "class-validator"

@Entity()
export class Message {

	@PrimaryGeneratedColumn({
		name: 'MessageID',
	})
	id: number;


	@IsNotEmpty()
	value: string;

}
