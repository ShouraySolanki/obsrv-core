import { Kafka } from 'kafkajs'
import _ from 'lodash'

interface JobCounts {
    successCount: number,
    failureCount: number,
    duplicateCount?: number,
}
const kafka = new Kafka({
    brokers: ["localhost:9092"],
})

async function listTopics() {
    try {
        const admin = kafka.admin()
        await admin.connect()
        const topicMetadata = await admin.fetchTopicMetadata()

        const topics = topicMetadata.topics
            .filter(topic => !topic.name.startsWith("__"))
            .map(topic => topic.name)
        await admin.disconnect()
        return topics
    } catch (error: any) {
        console.log(error)
    }
}
async function getTotalEventCount(topic: string): Promise<number> {
    try {
        const admin = kafka.admin()
        await admin.connect()
        const partitions = await admin.fetchTopicOffsets(topic)
        const totalEventCount = partitions.reduce((count, partition) => count + Number(partition.high), 0)
        await admin.disconnect()
        return totalEventCount
    } catch (error: any) {
        console.log(error)
        throw new Error(`Failed to get total event count for topic ${topic}`)
    }
}

async function getEventById(topic: string, id: string) {
    const consumer = kafka.consumer({
        groupId: `consumer ${Math.random()}`
    })
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })
    const matchedEventPromise = new Promise((resolve) => {
        consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const event = JSON.parse(message.value?.toString() || "")
                if (event.id === id) {
                    resolve(event)
                }
            }
        })
    })

    const matchedEvent = await matchedEventPromise
    // await consumer.disconnect()
    return matchedEvent
}

async function main() {
    const topics: any[] = await listTopics() || []
    console.log("List of topics available in Kafka:", topics)
    const eventCounts: any = await Promise.all(
        topics.map(async (topic) => {
            const count = await getTotalEventCount(topic)
            return { [topic]: count }
        })
    )
    console.log("total events in each topic", eventCounts)
     const matchedEvent = await getEventById("dev.ingest", "1ecca21b-2880-48a3-a5a6-da544d823c36")
    !_.isUndefined(matchedEvent) ? console.log("event matched with id", matchedEvent) : console.log("no event matches with the id")
 }

main()
 