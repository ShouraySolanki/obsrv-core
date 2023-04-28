import tasks from './tasks';

(async () => {

    const createTables = tasks.get("createTables")
    const createMasterDataset = tasks.get("createMasterDataset");
    const createDataset = tasks.get("createDataset")
    const pushEventsToMasterDataset = tasks.get("pushEventsToMasterDataset")
    const pushEventsToDataset = tasks.get("pushEventsToDataset")
    if (createTables) {
        try {
            createTables.handler({})();
        } catch (error) {
            console.log(error);

        }

    }
    if (createMasterDataset) {
        try {
            createMasterDataset.handler({})();
        } catch (error) {
            console.log(error);

        }

    }
    if (createDataset) {
        try {
            createDataset.handler({})();
        } catch (error) {
            console.log(error);

        }

    }
    if (pushEventsToMasterDataset) {
        try {
            pushEventsToMasterDataset.handler({})();
        } catch (error) {
            console.log(error);

        }
    }
    if (pushEventsToDataset) {
        try {
            pushEventsToDataset.handler({})();
        } catch (error) {
            console.log(error);

        }
    }


})()