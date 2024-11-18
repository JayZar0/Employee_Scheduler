import {IsInt, IsNotEmpty, Max, Min} from "class-validator";
import {Column} from "typeorm";

/*
    Data transfer object used to map FK's to the entities
 */

export class ShiftDTO {

    @IsNotEmpty()
    employeeID: string; // FK

    @IsInt()
    departmentID: number; // FK

    @IsNotEmpty()
    day:Date

    @IsInt()
    @Max(23)
    @Min(1)
    startHour: number;

    @IsInt()
    @Max(24)
    @Min(2)
    endHour: number;
}