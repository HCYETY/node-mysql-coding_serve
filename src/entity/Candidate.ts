import { TEST_STATUS } from '../../src/config/const';
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

  @Column()
  test_status: string = TEST_STATUS.NODO;

  @Column("longtext")
  program_answer: string = '';

  @Column("bigint")
  time_end: number = 0;

  @Column()
  watch: boolean = true;

  @Column()
  score: number = 0;
}