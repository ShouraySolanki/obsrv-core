import { assertCounts } from "../utils/assertCounts"

export default {
    index: 1,
    name: 'assertCounts',
    handler: (payloadFromPreviousTasks: Record<string, any>) => {
        return async () => {
            await assertCounts()
        }
    }
}