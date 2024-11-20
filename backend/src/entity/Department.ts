import { IsNotEmpty, IsOptional, Matches } from "class-validator"
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class Department {

    @PrimaryGeneratedColumn()
    @IsOptional()
    id: String

    @Column({ type: "nvarchar" })
    @IsNotEmpty({ message: "Department must have a name" })
    @Matches(/[A-Za-z]*(\s[A-Za-z]*)*?/, {message: "Department names may only be alphabetical characters"})
    name: string

    @Column({ type: "decimal" })
    @IsOptional()
    wage: number

}