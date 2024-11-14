import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Employee } from "./Employee"
import { Department } from "./Department"
import { IsOptional, Max, Min } from "class-validator"

@Entity()
export class Shift {

    @PrimaryGeneratedColumn()
    @IsOptional()
    id: string

    // This is a foreign key that references the employee working the shift
    @ManyToOne(type => Employee)
    @JoinColumn({ name: "employeeID"})
    employeeID: Employee

    // This is a foreign key that references the department assigned to the shift
    @ManyToOne(type => Department)
    @JoinColumn({ name: "departmentID" })
    departmentID: Department

    @Column({ type: 'int' })
    @Max(23)
    @Min(1)
    startHour: number

    @Column({ type: 'int' })
    @Max(24)
    @Min(2)
    endHour: number

}