import { Entity, PrimaryGeneratedColumn, Column, OneToMany, } from 'typeorm';
import { paperStatus } from '../config/types';
import Test from './Test';

@Entity({ database: "alimydb" })
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
  join_num: number = 0;

  @Column()
  look_over: boolean = false;

  @Column("bigint")
  time_begin: number = 0;

  @Column("bigint")
  time_end: number = 0;

  @Column()
  remaining_time: boolean = false;
  
  @Column()
  answer_time: string = '';
}