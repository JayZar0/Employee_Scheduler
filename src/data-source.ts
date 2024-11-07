import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Employee } from "./entity/Employee"

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: './sqlite.db',
    synchronize: true,
    logging: false,
    entities: [User, Employee],
    migrations: [],
    subscribers: [],
})
