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
	captcha: number = 0;

	// @Column("date", { default: null })
	// nowtime_captcha: Date;
	@Column("bigint")
	nowtime_captcha: number;

	@Column({ default: null })
	session: string = '';

	@Column()
	interviewer: boolean = false;
}