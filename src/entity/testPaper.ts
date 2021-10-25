import { Entity, PrimaryGeneratedColumn, Column, OneToMany, } from 'typeorm';
import { paperStatus } from '../config/types';
import Test from './Test';

@Entity({ database: "fieldwork" })
export default class TestPaper {
  @PrimaryGeneratedColumn()
  key: number = 0;

  @Column()
  interviewer: string = null;

  @Column()
  paper: string = null;

  @Column("longtext")
  paper_description: string; 

  @OneToMany(type => Test, test => test.paper)
  tests: Test[];

  @Column()
  tests_num: number = 1;

  @Column()
  paper_point: number = 0;
  
  @Column()
  check: boolean = true;

  @Column("simple-array")
  candidate?: string[];

  @Column()
  time_begin: string = null;

  @Column()
  time_end: string = null;

  @Column()
  remaining_time: boolean = false;
  
  @Column()
  answer_time: string = null;
}