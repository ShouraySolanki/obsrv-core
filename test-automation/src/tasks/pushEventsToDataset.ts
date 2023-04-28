const { pushObsEvents } = require('../utils/obs')

export default {
    index: 1,
    name: 'pushEventsToDataset',
    handler: (payloadFromPreviousTasks: Record<string, any>) => {
        return async () => {
            await pushObsEvents(1)
        }
    }
}

 