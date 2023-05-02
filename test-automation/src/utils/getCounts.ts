import { Kafka } from 'kafkajs'
import _ from 'lodash'
import { datasetTopics } from '../data/kafka-topics/topics'
import fs from 'fs'

interface JobCounts {
    successCount: number,
    failureCount: number,
    duplicateCount?: number,
}
const kafka = new Kafka({
    brokers: ["localhost:9092"],
})

export async function listTopics() {
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
export async function getEventCount(topic: string): Promise<number> {
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

export async function getEventById(topic: string, id: string) {
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

export async function getAllEventsCount() {
    const topics: any[] = await listTopics() || []
    const eventCounts: any = await Promise.all(
        topics.map(async (topic) => {
            const count = await getEventCount(topic)
            return { [topic]: count }
        })
    )
    const mergedCounts = Object.assign({}, ...eventCounts)
    const fetchedEventCounts: any = {}
    for (var [alias, topic] of Object.entries(datasetTopics)) {
        fetchedEventCounts[alias] = mergedCounts[topic]
    }
    fs.writeFileSync(__dirname + "/../data/event-generate/outputCounts.json", JSON.stringify(fetchedEventCounts));
    return fetchedEventCounts
}