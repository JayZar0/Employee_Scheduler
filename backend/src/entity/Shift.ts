import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Employee } from "./Employee"
import { Department } from "./Department"
import { IsNotEmpty, IsOptional, Max, Min } from "class-validator"

/*
    This is the "real" shift object that actually references other entities with the FK's
    as opposed to the ShiftDTO which handles the FK id's
 */

@Entity()
export class Shift {

    @PrimaryGeneratedColumn()
    @IsOptional()
    id: string

    // This is a foreign key that references the employee working the shift
    @ManyToOne(type => Employee, { eager: true })
    @JoinColumn({ name: "employeeID"})
    employeeID: Employee

    // This is a foreign key that references the department assigned to the shift
    @ManyToOne(type => Department, { eager: true })
    @JoinColumn({ name: "departmentID" })
    departmentID: Department

    @Column({ type: 'date' })
    @IsNotEmpty({ message: 'Date of shift must be provided' })
    day:Date

    @Column({ type: 'int' })
    @Max(24, { message: 'Hours cannot be greater than 24 military time' })
    @Min(1, { message: 'Hours cannot be less than 1 military time' })
    @IsNotEmpty({ message: 'Starting hour of shift must be provided' })
    startHour: number

    @Column({ type: 'int' })
    @Max(24, { message: 'Hours cannot be greater than 24 military time' })
    @Min(1, { message: 'Hours cannot be less than 1 military time' })
    @IsNotEmpty({ message: 'Ending hour of shift must be provided' })
    endHour: number
}