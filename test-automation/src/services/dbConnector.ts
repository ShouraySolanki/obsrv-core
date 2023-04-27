import { createQueries } from "../data/tables";
import { Sequelize } from "sequelize"

export const createTables = async () => {
    const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/test');
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
