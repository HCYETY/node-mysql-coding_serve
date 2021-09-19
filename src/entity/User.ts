import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    account: string= '';
    
    @Column()
    password: string= '';

    @Column()
    session: string = '';
}

export default User