import { Entity, PrimaryGeneratedColumn, Column, OneToMany, } from 'typeorm';
import { paperStatus } from '../config/types';
import Test from './Test';

@Entity({ database: "fieldwork" })
export default class TestPaper {
  @PrimaryGeneratedColumn()
  key: number = 0;

  @Column()
  paper: string = null;

  @Column("longtext")
  paper_description: string; 

  @OneToMany(type => Test, test => test.paper)
  tests: Test[];

  @Column()
  tests_num: number;

  @Column()
  paper_point: number;
  
  @Column()
  check: number;

  @Column("simple-array")
  candidate?: string[];

  @Column()
  time: string;

  @Column()
  remaining_time: string;
}