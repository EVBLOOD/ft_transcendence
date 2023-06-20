import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, Matches, isNumber } from 'class-validator';
import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'Users' })
export class User {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  @Matches(/^[a-zA-Z]+(-[a-zA-Z]+)?$/)
  username: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

  @Column()
  @IsBoolean()
  TwoFAenabled: boolean;

  @Exclude()
  @Column({ nullable: true })
  backups: string;

  @Exclude()
  @Column({ nullable: true })
  TwoFAsecret: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
