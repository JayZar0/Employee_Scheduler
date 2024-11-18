import { IsNotEmpty, IsOptional, Max, Min } from "class-validator"
import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm"

@Entity()
export class Employee {

    @PrimaryGeneratedColumn("uuid")
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

    @Column({ type: "boolean", default: false, nullable: true })
    @IsOptional()
    isManager: boolean

    @Column({ nullable: true} )
    bearerToken: string
}