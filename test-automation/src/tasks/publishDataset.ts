import { publishDataset } from "../services/dataset";
import publishPayload from '../data/requestPayload/publish'

export default {
    index: 1,
    name: 'publishDataset',
    handler: (payloadFromPreviousTasks: Record<string, any>) => {
        return async () => {
            await publishDataset({ data: publishPayload.dataset.observation, config: {} })
        }
    }
}
