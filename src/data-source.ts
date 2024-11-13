import "reflect-metadata"
import { DataSource } from "typeorm"
import { Employee } from "./entity/Employee"
import { Shift } from "./entity/Shift"
import { Department } from "./entity/Department"

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: './sqlite.db',
    synchronize: true,
    logging: false,
    entities: [Employee, Department, Shift],
    migrations: [],
    subscribers: [],
})
