import { IsNotEmpty, IsOptional } from "class-validator"
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm"

@Entity()
export class Department {

    @PrimaryGeneratedColumn()
    @IsOptional()
    id: String

    @Column({ type: "nvarchar" })
    @IsNotEmpty()
    name: string

    @Column({ type: "decimal" })
    @IsOptional()
    wage: number

}