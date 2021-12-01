import { Entity, PrimaryGeneratedColumn, Column, } from 'typeorm';

@Entity({ database: "fieldwork" })
export default class Interview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("simple-array")
  interviewer: string[];

  @Column()
  candidate: string = null;

  @Column()
  interview_room: number = 0;

  @Column("bigint")
  interview_begin_time: number = 0;

  @Column()
  interviewer_link: string = null;

  @Column()
  candidate_link: string = null;

  @Column()
  evaluation: string = null;
  
  @Column()
  comment: string = null;
}