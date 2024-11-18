import { IsInt, Max, Min } from "class-validator";

/*
    Data transfer object used to map FK's to the entities
 */

export class ShiftDTO {

    @IsInt()
    employeeID: string; // FK

    @IsInt()
    departmentID: number; // FK

    @IsInt()
    @Max(23)
    @Min(1)
    startHour: number;

    @IsInt()
    @Max(24)
    @Min(2)
    endHour: number;
}