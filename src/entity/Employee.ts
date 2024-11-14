import { IsNotEmpty, IsOptional, Max, Min } from "class-validator"
import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"

@Entity()
export class Employee {

    @PrimaryGeneratedColumn()
    @IsOptional()
    id: string

    @Column({ type: "nvarchar" })
    @IsNotEmpty({ message: "The first name is required" })
    firstName: string

    @Column({ type: "nvarchar" })
    @IsNotEmpty({ message: "The last name is required" })
    lastName: string

    @Column({ type: "int" })
    @IsOptional()
    @Max(40, { message: "The max amount of requested hours of an employee cannot exceed 40" })
    @Min(3, { message: "The minimum of hours that must be worked is 3 hours in a business week" })
    maxHours: number

    // This is going to be a foreign key that references another employee
    @Column({ type:"nvarchar" })
    @OneToOne(type => Employee)
    @IsOptional()
    managedBy: Employee

}