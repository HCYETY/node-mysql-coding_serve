import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import Test from "./Test";

@Entity({ database: "fieldwork" })
export default class Comment {
	@PrimaryGeneratedColumn()
	key: number = 0;

	@Column()
  like_num: number = 0;

  @Column()
  dislike_num: number = 0;

  @ManyToOne(type => Test, test => test.comments)
  @JoinColumn()
  tests: Test;
}