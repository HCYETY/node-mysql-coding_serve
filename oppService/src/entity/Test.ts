import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, } from 'typeorm';
import TestPaper from './TestPaper';

@Entity({ database: "exmydb" })
export default class Test {
  @PrimaryGeneratedColumn()
  key: number;

  @Column()
  num: string;

  @Column()
  test_name: string;
  
  @Column("longtext", { default: null })
  test: string;

  @ManyToOne(type => TestPaper, paper => paper.tests)
  @JoinColumn()
  paper: TestPaper;

  @Column("longtext", { default: null })
  answer: string;

  @Column("simple-array", { default: null })
  tags: string[];

  @Column()
  level: string;

  @Column()
  point: number;
}