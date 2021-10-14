import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, } from 'typeorm';
import testPaper from '../entity/testPaper';

@Entity({ database: "itembank" })
export default class test {
  @PrimaryGeneratedColumn()
  key: number;

  @Column()
  num: number = 0;

  @Column()
  testName: string = null;
  
  @Column("longtext")
  test: string;

  @ManyToOne(type => testPaper, paper => paper.tests)
  @JoinColumn()
  paper: testPaper[];

  @Column("longtext")
  answer: string;

  @Column("simple-array")
  tags: string[];

  @Column()
  level: string;

  @Column()
  point: number;
}