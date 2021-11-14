import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ database: "fieldwork" })
export default class Comment {
	@PrimaryGeneratedColumn()
	key: number = 0;

	@Column()
  like_num: number = 0;

  @Column()
  dislike_num: number = 0;
}