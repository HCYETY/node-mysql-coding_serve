import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ database: "fieldwork" })
export default class User {
	@PrimaryGeneratedColumn()
	key: number = 0;

	@Column()
	account: string = '';

	@Column()
	password: string = '';

	@Column()
	email: string = '';

	@Column()
	cypher: string = '';

	@Column()
	captcha: string = '';

	// @Column()
	// nowtime_captcha: string = '';
	@Column("date", { default: null })
	nowtime_captcha: Date;

	@Column({ default: null })
	session: string = '';

	@Column()
	interviewer: boolean = false;
}