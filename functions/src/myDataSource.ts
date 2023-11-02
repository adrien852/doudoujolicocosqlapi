import { DataSource } from "typeorm"

// establish database connection
const connToDS = async() => {
    const dataSourceConn = new DataSource(
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
    try{
        await dataSourceConn.initialize();
        console.log("Data Source has been initialized!");
        return dataSourceConn;
    }catch(err){
        console.error("Error during Data Source initialization", err);        
    }
}

export const serviceDS = connToDS();