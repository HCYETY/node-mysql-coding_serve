import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export enum paper_level {
  easy = "简单",
  middle = "中等",
  hard = "困难"
}
export enum paper_status {
	yes = "已完成",
	no = "未完成",
	ing = "尝试中"
}

@Entity()
class test_paper {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  paper: number = 0;

  @Column("simple-array")
  tags: string[] = [""];

  @Column({
    type: 'enum',
    enum: paper_level,
    default: paper_level.easy
  })
  level: paper_level;

  @Column()
  pass: number = 0;

  @Column()
  time: string = '';

  @Column({
    type: 'enum',
    enum: paper_status,
    default: paper_status.no
  })
  status: paper_status;
}

export default test_paper;