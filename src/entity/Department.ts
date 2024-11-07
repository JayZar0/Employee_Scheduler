import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne} from "typeorm"

@Entity()
export class Department {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    wage: number

}