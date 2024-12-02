import {IsInt, IsNotEmpty, Max, Min} from "class-validator";
import {Column} from "typeorm";

/*
    Data transfer object used to map FK's to the entities
    This is the first object that you actually "write to"
    You then map this to Shift to actually create the FK's
 */

export class ShiftDTO {

    @IsNotEmpty()
    employeeID: string; // FK

    @IsInt()
    departmentID: number; // FK

    @IsNotEmpty()
    day:Date

    @IsInt()
    @Max(24)
    @Min(1)
    startHour: number;

    @IsInt()
    @Max(24)
    @Min(1)
    endHour: number;
}