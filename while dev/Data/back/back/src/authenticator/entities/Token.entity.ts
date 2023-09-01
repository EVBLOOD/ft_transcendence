import { Exclude } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Token {
  @Exclude()
  @PrimaryColumn()
  token: string;

  @Exclude()
  @Column()
  expiration_date: Date;

  @Column()
  loggedIn: boolean;


  @OneToOne(() => User)
  @JoinColumn()
  User: User;

  constructor(partial: Partial<Token>) {
    Object.assign(this, partial);
  }
}
