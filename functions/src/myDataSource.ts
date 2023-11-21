import { DataSource } from "typeorm"
import * as dotenv from "dotenv";
dotenv.config();

    export const myDataSource = new DataSource(
        {
            type: "mysql",
            host: process.env.DATABASE_HOST,
            port: 3306,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
            database: process.env.DATABASE_DB,
            entities: [`${__dirname}/entity/*{.js,.ts}`],
            logging: true,
            synchronize: true,
        }
    );
