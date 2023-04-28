import { pushMasterEvents } from "../utils/master";
 
export default {
    index: 1,
    name: 'pushEventsToMasterDataset',
    handler: (payloadFromPreviousTasks: Record<string, any>) => {
        return async () => {
            await pushMasterEvents()
        }
    }
}