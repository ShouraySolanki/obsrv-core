import { publishDataset } from "../services/dataset";
import publishPayload from '../data/requestPayload/publish'

export default {
    index: 1,
    name: 'publishMasterDataset',
    handler: (payloadFromPreviousTasks: Record<string, any>) => {
        return async () => {
            await publishDataset({ data: publishPayload.master.observation, config: {} })
        }
    }
}
