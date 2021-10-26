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

  @Column("longtext")
  program_answer: string = '';

  @Column()
  time_end: string = null;

  @Column()
  over: boolean = false;

  @Column()
  watch: boolean = true;
}