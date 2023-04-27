import { createQueries } from "../data/tables";
import { Sequelize } from "sequelize"
import * as config from '../config' 
export const createTables = async () => {
    const sequelize = new Sequelize({
        dialect: 'postgres',
        host: config.default.POSTGRES_HOST,
        port: parseInt(config.default.POSTGRES_PORT),
        username: config.default.POSTGRES_USERNAME,
        password: config.default.POSTGRES_PASSWORD,
        database: config.default.POSTGRES_DATABASE
    });
    for (const tableSqlObject of createQueries) {
        const tableName: string = Object.keys(tableSqlObject)[0];
        const sqlQuery: string = Object.values(tableSqlObject)[0];
        try {
            await sequelize.query(sqlQuery);
            return true;
        } catch (err) {
            console.error(`Failed to create table ${tableName}: ${err}`);
            throw err;
        }
    }
    sequelize.close()
}
