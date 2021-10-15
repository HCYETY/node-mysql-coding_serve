import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, } from 'typeorm';
import TestPaper from './TestPaper';

@Entity({ database: "itembank" })
export default class Test {
  @PrimaryGeneratedColumn()
  key: number;

  @Column()
  num: number = 0;

  @Column()
  test_name: string = null;
  
  @Column("longtext")
  test: string;

  @ManyToOne(type => TestPaper, paper => paper.tests)
  @JoinColumn()
  paper: TestPaper[];

  @Column("longtext")
  answer: string;

  @Column("simple-array")
  tags: string[];

  @Column()
  level: string;

  @Column()
  point: number;
}