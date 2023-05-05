import tasks from './tasks';
import { getAllEventsCount } from './utils/getCounts';

(async () => {

    const createTables = tasks.get("createTables")
    const createMasterDataset = tasks.get("createMasterDataset");
    const createDataset = tasks.get("createDataset")
    const publishMasterDataset = tasks.get("publishMasterDataset")
    const publishDataset = tasks.get("publishDataset")
    const pushEventsToMasterDataset = tasks.get("pushEventsToMasterDataset")
    const pushEventsToDataset = tasks.get("pushEventsToDataset")
    const assertCounts = tasks.get("assertCounts")
    const wait = tasks.get("wait")
    // if (createMasterDataset) {
    //     try {
    //         await createMasterDataset.handler({})();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    // if (createDataset) {
    //     try {
    //         await createDataset.handler({})();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    // if (publishMasterDataset) {
    //     try {
    //         await publishMasterDataset.handler({})();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    // if (publishDataset) {
    //     try {
    //         await publishDataset.handler({})();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    // if (pushEventsToMasterDataset) {
    //     try {
    //         await pushEventsToMasterDataset.handler({})();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    if (pushEventsToDataset) {
        try {
            await pushEventsToDataset.handler({})()
        } catch (error) {
            console.log(error);
        }
    }
    if (wait) {
        try {
            await wait.handler({})()
        } catch (error) {
            console.log(error);
        }
    }
    if (assertCounts) {
        try {
            await getAllEventsCount()
            await assertCounts.handler({})()
        } catch (error) {
            console.log(error);
        }
    }
})()