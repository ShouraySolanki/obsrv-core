import { pushMasterEvents } from "../utils/master";
export const observationsMasterDataset = "observations-assets"

export default {
    index: 1,
    name: 'pushEventsToMasterDataset',
    handler: (payloadFromPreviousTasks: Record<string, any>) => {
        return async () => {
            await pushMasterEvents()
        }
    }
}