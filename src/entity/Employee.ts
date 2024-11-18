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
    @Min(3, { message: "The minimum hours that must be worked in a business week is 3 hours" })
    maxHours: number

    // This is going to be a foreign key that references another employee
    @Column({ type: "bool" })
    @IsOptional()
    isManager: boolean

}