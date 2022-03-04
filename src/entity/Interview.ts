import { INTERVIEW_STATUS } from '../config/const';
import { Entity, PrimaryGeneratedColumn, Column, } from 'typeorm';

@Entity({ database: "alimydb" })
export default class Interview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("simple-array")
  interviewer: string[];

  @Column()
  candidate: string = '';

  @Column()
  interview_room: number = 0;

  @Column("bigint")
  interview_begin_time: number = 0;

  @Column()
  interviewer_link: string = '';

  @Column()
  candidate_link: string = '';

  @Column()
  interview_status: string = INTERVIEW_STATUS.NO;

  @Column()
  evaluation: string = '';
  
  @Column()
  comment: string = '';
}