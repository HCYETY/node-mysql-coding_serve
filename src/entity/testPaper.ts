import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { paperStatus} from '../config/types';

@Entity()
export default class test_paper {
  @PrimaryGeneratedColumn()
  key: number = 0;

  @Column()
  paper: string = '';

  @Column("simple-array")
  tags: string[] = [""];

  @Column()
  level: string = '';
  
  @Column()
  pass?: number = 0;
  
  @Column()
  time: string = '';

  @Column()
  paperNum: number = 1;

  @Column()
  remaining_time: string = '';
  
  @Column()
  status: string = paperStatus.nobegin;

  @Column()
  check: boolean = false;

  @Column("simple-array")
  candidate: string[] = [""];
}