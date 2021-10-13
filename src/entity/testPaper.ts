import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, } from 'typeorm';
import { paperStatus } from '../config/types';
import test from '../entity/test';

@Entity({ database: "fieldwork" })
export default class test_paper {
  @PrimaryGeneratedColumn()
  key: number = 0;

  @Column()
  paper: string = null;

  @OneToMany(type => test, test => test.paper)
  @JoinColumn()
  tests: test[];

  @Column("simple-array")
  tags: string[] = [""];

  @Column()
  pass?: number = 0;
  
  @Column()
  time: string = '';

  @Column()
  paperNum: number = 1;

  @Column()
  remaining_time: string = '';
  
  @Column()
  check: boolean = false;

  @Column("simple-array")
  candidate?: string[] = [""];
}