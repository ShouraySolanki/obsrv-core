const { pushObsEvents } = require('../utils/obs')
export const batchSize = 100
export default {
    index: 1,
    name: 'pushEventsToDataset',
    handler: (payloadFromPreviousTasks: Record<string, any>) => {
        return async () => {
            await pushObsEvents(batchSize)
        }
    }
}

