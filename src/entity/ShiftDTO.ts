import { IsInt, Max, Min } from "class-validator";

export class ShiftDTO {
    @IsInt()
    employeeID: number;

    @IsInt()
    departmentID: number;

    @IsInt()
    @Max(23)
    @Min(1)
    startHour: number;

    @IsInt()
    @Max(24)
    @Min(2)
    endHour: number;
}