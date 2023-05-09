
export default {
    index: 1,
    name: 'wait',
    handler: (payloadFromPreviousTasks: Record<string, any>) => {
        return async () => {
            console.log("waiting for metrics...")
            await new Promise(r => setTimeout(r, 240000))
        }
    }
}