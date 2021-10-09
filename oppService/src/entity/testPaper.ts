import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { paperStatus} from '../config/types';

@Entity()
export default class test_paper {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  paper: string = '';

  @Column("simple-array")
  tags?: string[] = [""];

  @Column()
  level: string = '';
  
  @Column()
  pass?: number = 0;
  
  @Column()
  time: string = '';

  @Column()
  paperNum: number = 1;
  
  @Column()
  status: string = paperStatus.nobegin;
}