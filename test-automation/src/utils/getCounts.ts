import { Kafka } from 'kafkajs'
import _ from 'lodash'
import { datasetTopics } from '../data/kafka-topics/topics'
import { querySystemStats } from '../services/dataset'
import { queryStats } from '../data/queries/query-stats'
import { assertMetaData } from '../data/event-generate/assertMeta'
import fs from 'fs'

interface JobCounts {
    successCount: number,
    failureCount: number,
    duplicateCount?: number,
}
const kafka = new Kafka({
    brokers: ["localhost:9092"],
})
const transformTopic = datasetTopics.transform
const assertRefList = assertMetaData.sourceAssertRefs
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

export async function getEventById() {
    const consumer = kafka.consumer({
        groupId: `consumer ${Math.random()}`
    })
    await consumer.connect()
    await consumer.subscribe({ topic: transformTopic, fromBeginning: true, })
    const matchedEventPromise = new Promise((resolve) => {
        consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(message.value)
                const event = JSON.parse(message.value?.toString() || "")
                console.log(event)
                if (event.assertRef === assertRefList[0].assetRef) {
                    resolve(event)
                }
            }
        })
    })
    const matchedEvent = await matchedEventPromise
    console.log(matchedEvent)
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
    // fetchedEventCounts.druidSystemStats = await getSystemStatsCount()
    fs.writeFileSync(__dirname + "/../data/event-generate/outputCounts.json", JSON.stringify(fetchedEventCounts));
    return { mergedCounts, fetchedEventCounts }
}

export async function getSystemStatsCount() {
    const response = await (await querySystemStats(queryStats)).data.result[0].result
    return response.eventsCount
}