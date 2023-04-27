import { createTables } from "../services/dbConnector";
export default {
    index: 1,
    name: 'createTables',
    handler: (payloadFromPreviousTasks: Record<string, any>) => {
        return async () => {
            return createTables()
        }
    }
}
