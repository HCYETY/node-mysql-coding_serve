import { Entity, PrimaryGeneratedColumn, Column, } from 'typeorm';

@Entity({ database: "fieldwork" })
export default class Candidate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string = null;

  @Column()
  paper: string = null;

  @Column()
  test_name: string = null;

  @Column()
  test_level: string = null;

  @Column("longtext")
  program_answer: string = '';

  @Column("bigint")
  time_end: number = 0;

  @Column()
  over: boolean = false;

  @Column()
  watch: boolean = true;
}