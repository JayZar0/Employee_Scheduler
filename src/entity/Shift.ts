import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class Shift {

    @PrimaryGeneratedColumn()
    id: string

    // This is a foreign key that references the employee working the shift
    @Column()
    workedBy: number

    // This is a foreign key that references the department assigned to the shift
    @Column()
    department: number

    @Column()
    startHour: number

    @Column()
    endHour: number

}