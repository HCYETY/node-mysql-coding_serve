import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, } from 'typeorm';
import TestPaper from './TestPaper';

@Entity({ database: "examydb" })
export default class Test {
  @PrimaryGeneratedColumn()
  key: number;

  @Column()
  num: string;

  @Column()
  test_name: string;
  
  @Column("longtext")
  test: string;

  @ManyToOne(type => TestPaper, paper => paper.tests)
  @JoinColumn()
  paper: TestPaper;

  @Column("longtext")
  answer: string;

  @Column("simple-array")
  tags: string[];

  @Column()
  level: string;

  @Column()
  point: number;
}