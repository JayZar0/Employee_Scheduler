import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class Department {

    @PrimaryGeneratedColumn()
    id: String

    @Column()
    name: string

    @Column()
    wage: number

}