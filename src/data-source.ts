import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Employee } from "./entity/Employee"
import {Shift} from "./entity/Shift";
import {Department} from "./entity/Department";

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: './sqlite.db',
    synchronize: true,
    logging: false,
    entities: [User, Employee, Department, Shift],
    migrations: [],
    subscribers: [],
})
