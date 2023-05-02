import async from 'async';
import tasks from './tasks';
import { getAllEventsCount } from './utils/getCounts';

(async () => {

    const createTables = tasks.get("createTables")
    const createMasterDataset = tasks.get("createMasterDataset");
    const createDataset = tasks.get("createDataset")
    const pushEventsToMasterDataset = tasks.get("pushEventsToMasterDataset")
    const pushEventsToDataset = tasks.get("pushEventsToDataset")
    await getAllEventsCount()
    // if (createTables) {
    //     try {
    //         createTables.handler({})();
    //     } catch (error) {
    //         console.log(error);


    //     }

    // }
    // if (createMasterDataset) {
    //     try {
    //         createMasterDataset.handler({})();
    //     } catch (error) {
    //         console.log(error);


    //     }

    // }
    // if (createDataset) {
    //     try {
    //         createDataset.handler({})();
    //     } catch (error) {
    //         console.log(error);
    //     }

    // }


    // if (pushEventsToMasterDataset) {
    //     try {
    //         pushEventsToMasterDataset.handler({})();
    //     } catch (error) {
    //         console.log(error);

    //     }
    // }
    if (pushEventsToDataset) {
        try {
            pushEventsToDataset.handler({})();
        } catch (error) {
            console.log(error);


        }
    }


})()