import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, } from 'typeorm';
import testPaper from '../entity/testPaper';

@Entity({ database: "itembank" })
export default class test {
  @PrimaryGeneratedColumn()
  key: number;

  @Column()
  num: number = 0;

  @Column()
  testName: string;
  
  @Column("longtext")
  test: string;

  @ManyToOne(type => testPaper, paper => paper.tests)
  @JoinColumn({ name: 'test_to_paper' })
  paper: testPaper;

  @Column("longtext")
  answer: string;

  @Column("simple-array")
  tags: string[];

  @Column()
  level: string;

  @Column()
  point: number;
}