import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class test {
  @PrimaryGeneratedColumn()
  key: number = 0;

  @Column()
  num: number = 0;

  @Column()
  testName: string = '';

  // @Column("longtext")
  // test: 

  @Column("simple-array")
  testTags: string[] = [""];

  @Column()
  level: string = '';

  @Column()
  point: number = 0;
}