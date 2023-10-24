import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_DB,
    entities: ["src/entity/*.js"],
    logging: true,
    synchronize: true,
})