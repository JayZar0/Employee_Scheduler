// import {IsIn, IsInt, IsNotEmpty, Max, Min} from "class-validator";
// /*
//     Data transfer object used to support FK's
//  */
//
//
// export class EmployeeDTO {
//     @IsInt()
//     id: string
//
//     @IsNotEmpty()
//     firstname: string
//
//     @IsNotEmpty()
//     lastname: string
//
//     @IsInt()
//     @Max(40)
//     @Min(3)
//     maxHours: number
//
//     @IsInt()
//     managedBy: number // FK to another employee's id
// }