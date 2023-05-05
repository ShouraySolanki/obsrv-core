
export default {
    index: 1,
    name: 'wait',
    handler: (payloadFromPreviousTasks: Record<string, any>) => {
        return async () => {
            await new Promise(r => setTimeout(r, 240000))
        }
    }
}