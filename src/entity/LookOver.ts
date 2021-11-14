import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ database: "fieldwork" })
export default class LookOver {
	@PrimaryGeneratedColumn()
	key: number = 0;

	@Column()
  email: string = null;

  @Column()
  paper: string = null;

  @Column()
  total_score: number = 0;

  @Column()
  rank: number = 0;

  @Column()
  use_time: number = 0;

  @Column()
  look_over: boolean = false;

  @Column()
  join: boolean = false;
}