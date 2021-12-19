import { TEST_STATUS } from '../../src/config/const';
import { Entity, PrimaryGeneratedColumn, Column, } from 'typeorm';

@Entity({ database: "alimydb" })
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

  @Column()
  test_status: string = TEST_STATUS.NODO;

  @Column("simple-array", { default: null })
  tags: string[];

  @Column("longtext")
  program_answer: string = '';

  @Column()
  program_language: string = '';

  @Column()
  submit_num: number = 0;

  @Column()
  score: number = 0;

  @Column("bigint")
  answer_begin: number = 0;

  @Column("bigint")
  answer_end: number = 0;

  @Column("bigint")
  time_end: number = 0;

  @Column()
  watch: boolean = true;
}