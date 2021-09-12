import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    account: string;
    
    @Column('int')
    password: string;
}

export default User