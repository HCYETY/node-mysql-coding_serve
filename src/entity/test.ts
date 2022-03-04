import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, } from 'typeorm';
import TestPaper from './TestPaper';
import Comment from './Comment';

@Entity({ database: "examydb" })
export default class Test {
  @PrimaryGeneratedColumn()
  key: number;

  @Column()
  num: string;

  @Column()
  test_name: string;
  
  @Column("longtext", { default: null })
  test: string;

  @OneToMany(type => Comment, comment => comment.tests)
  comments: Comment[];

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