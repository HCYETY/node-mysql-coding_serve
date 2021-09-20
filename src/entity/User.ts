import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
class User {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column()
    account: string = '';
    
    @Column()
    password: string = '';

    @Column()
    session: string = '';

    @Column()
    interviewer: boolean = false;
}

export default User;