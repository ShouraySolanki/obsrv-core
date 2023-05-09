import _ from 'lodash'
import { datasetTopics } from '../data/kafka-topics/topics'
import { querySystemStats } from '../services/dataset'
import { obsDatasourceQuery, queryStats } from '../data/queries/druid'
import { assertMetaData } from '../data/event-generate/assertMeta'
import { fetchRecords } from '../services/druid'
const kafka = require("../services/kafkaConnector")
import fs from "fs"

const assertRefList = assertMetaData.sourceAssertRefs
export async function listTopics() {
    try {
        const admin = kafka.admin()
        await admin.connect()
        const topicMetadata = await admin.fetchTopicMetadata()

        const topics = topicMetadata.topics
            .filter((topic: { name: string }) => !topic.name.startsWith("__"))
            .map((topic: { name: any }) => topic.name)
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
        const totalEventCount = partitions.reduce((count: number, partition: { high: any }) => count + Number(partition.high), 0)
        await admin.disconnect()
        return totalEventCount
    } catch (error: any) {
        console.log(error)
        throw new Error(`Failed to get total event count for topic ${topic}`)
    }
}

export async function getEventById(topicField: any) {
    const consumer = kafka.consumer({
        groupId: `consumer ${Math.random()}`
    })
    await consumer.connect()
    await consumer.subscribe({ topic: topicField, fromBeginning: true, })
    const matchedEventPromise = new Promise((resolve) => {
        consumer.run({
            eachMessage: async (data: any) => {
                const message = JSON.parse(data.message.value?.toString() || "")
                if (assertRefList.some(item => item.assetRef === message.event.assetRef)) {
                    resolve(message.event);
                }
            }
        })
    })
    const matchedEvent = await matchedEventPromise
    // await consumer.disconnect()
    return matchedEvent;
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
    fetchedEventCounts.druidSystemStats = await getSystemStatsCount()
    fetchedEventCounts.datasetRecordCount = await getDatasoureRecordCount()
    fs.writeFileSync(__dirname + "/../reports/outputCounts.json", JSON.stringify(fetchedEventCounts))
    return { mergedCounts, fetchedEventCounts }
}

export async function getSystemStatsCount() {
    const response = await (await querySystemStats(queryStats)).data.result[0].result
    return response.eventsCount
}
export async function getDatasoureRecordCount() {
    const response = await (await fetchRecords(obsDatasourceQuery)).data[0].result
    return response.eventsCount
}