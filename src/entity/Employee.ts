import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne} from "typeorm"

@Entity()
export class Employee {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    maxHours: number

    // This is going to be a foreign key that references another employee
    @Column()
    managedBy: number

}