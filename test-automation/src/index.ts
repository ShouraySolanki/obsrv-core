import async from 'async';
import tasks from './tasks';

(async () => {
    const createTableTask = tasks.get("createTables")?.handler({});
    const createMasterDataset = tasks.get("createMasterDataset")?.handler({});
    // async.waterfall()
})()