import inputCounts from '../data/event-generate/inputCounts.json'
import chai from "chai";
import * as _ from 'lodash'
import { getMetrics } from './getMetrics';
import { getAllEventsCount, getEventById } from './getCounts';
import fs from 'fs';

chai.should();

const assertionStages = [
    {
        stage: "ingestion",
        assertions: [
            {
                name: "prometheus: inputCountMatch",
                description: "This test is to verify the ingested batch count",
                assert: (input: any, metricOutput: any) => {
                    const expected = input.totalBatches
                    const actual = metricOutput.extraction_batch + metricOutput.extraction_duplicate + metricOutput.extraction_failed
                    const status = expected === actual;
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: inputCountMatch",
                description: "This test is to verify the ingested batch count",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.totalBatches
                    const actual = topicOutput.ingest
                    const status = expected === actual;
                    return { expected, actual, status }
                }
            }
        ]
    },
    {
        stage: "extractor",
        assertions: [
            {
                name: "prometheus: validateDuplicateBatch",
                description: "This test is to verify the total duplicate batches generated after extraction job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.duplicateBatches
                    const actual = metricOutput.extraction_duplicate
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "prometheus: validateInvalidBatch",
                description: "This test is to verify the total invalid batches generated after extraction job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.invalidBatches
                    const actual = metricOutput.extraction_failed
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "prometheus: validateValidBatch",
                description: "This test is to verify the total valid batches generated after extraction job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.validBatches
                    const actual = metricOutput.extraction_batch
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateDuplicateBatch",
                description: "This test is to verify the total duplicate batches generated after extraction job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.duplicateBatches
                    const actual = topicOutput.extractor_duplicate
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateInvalidBatch",
                description: "This test is to verify the total invalid batches generated after extraction job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.invalidBatches
                    const actual = topicOutput.extractor_failed
                    const status = expected === actual
                    return { expected, actual, status }
                }
            }
        ]
    },
    {
        stage: "preprocessor",
        assertions: [
            {
                name: "prometheus: validateRawEvents",
                description: "This test is to verify the count of total events pushed to raw topic",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.totalEventsInRaw
                    const actual = metricOutput.preprocessor_duplicate + metricOutput.preprocessor_invalid + metricOutput.preprocessor_unique
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "prometheus: validateInvalidSchemaEvents",
                description: "This test is to verify the count of total invalid events after preprocessor job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.invalidSchemaEvents
                    const actual = metricOutput.preprocessor_invalid
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "prometheus: validateDuplicateEventsCount",
                description: "This test is to verify the count of total duplicate events after preprocessor job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.duplicateEventsCount
                    const actual = metricOutput.preprocessor_duplicate
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "prometheus: validateUniqueEventsCount",
                description: "This test is to verify the count of total unique events after preprocessor job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.totalEventsInUnique
                    const actual = metricOutput.preprocessor_unique
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateRawEvents",
                description: "This test is to verify the count of total events pushed to raw topic",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.totalEventsInRaw
                    const actual = topicOutput.raw
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateInvalidSchemaEvents",
                description: "This test is to verify the count of total invalid events after preprocessor job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.invalidSchemaEvents
                    const actual = topicOutput.invalid
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateDuplicateEventsCount",
                description: "This test is to verify the count of total duplicate events after preprocessor job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.duplicateEventsCount
                    const actual = topicOutput.duplicate
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateUniqueEventsCount",
                description: "This test is to verify the count of total unique events after preprocessor job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.totalEventsInUnique
                    const actual = topicOutput.unique
                    const status = expected === actual
                    return { expected, actual, status }
                }
            }
        ]
    },
    {
        stage: "denorm",
        assertions: [
            {
                name: "prometheus: validateTotalDenormEventsCount",
                description: "This test is to verify the count of total events after denorm job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.totalEventsInDenorm
                    const actual = metricOutput.denorm_success + metricOutput.denorm_failed
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "prometheus: validateFailedDenormEventsCount",
                description: "This test is to verify the count of total failed events after denorm job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.failedDenormEvents
                    const actual = metricOutput.denorm_failed
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "prometheus: validateValidDenormEventsCount",
                description: "This test is to verify the count of total valid events after denorm job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.totalEventsInDenorm
                    const actual = metricOutput.denorm_success
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateTotalDenormEventsCount",
                description: "This test is to verify the count of total valid events after denorm job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.totalEventsInDenorm
                    const actual = topicOutput.denorm
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateFailedDenormEventsCount",
                description: "This test is to verify the count of total failed events after denorm job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.failedDenormEvents
                    const actual = topicOutput.denorm_failed
                    const status = expected === actual
                    return { expected, actual, status }
                }
            }
        ]
    },
    {
        stage: "transformer",
        assertions: [
            {
                name: "prometheus: validateTotalTransformedEventsCount",
                description: "This test is to verify the count of total events after transform job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.totalEventsInTransform
                    const actual = metricOutput.transform_success + metricOutput.transform_failed
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "prometheus: validateFailedTransformedEventsCount",
                description: "This test is to verify the count of total failed events after transform job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.failedTransformEvents
                    const actual = metricOutput.transform_failed
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "prometheus: validateValidTransformedEventsCount",
                description: "This test is to verify the count of total valid events after transform job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.totalEventsInTransform
                    const actual = metricOutput.transform_success
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateTotalTransformedEventsCount",
                description: "This test is to verify the count of total valid events after transform job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.totalEventsInTransform
                    const actual = topicOutput.transform
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateFailedTransformedEventsCount",
                description: "This test is to verify the count of total failed events after transform job",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.failedTransformEvents
                    const actual = topicOutput.transform_failed
                    const status = expected === actual
                    return { expected, actual, status }
                }
            }
        ]
    },
    {
        stage: "router",
        assertions: [
            {
                name: "prometheus: validateRouterTopicEventsCount",
                description: "This test is to verify the count of total events pushed to router topic",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.totalEventsInTransform
                    const actual = metricOutput.router_success
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateRouterTopicEventsCount",
                description: "This test is to verify the count of total events pushed to router topic",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.totalEventsInTransform
                    const actual = topicOutput.router
                    const status = expected === actual
                    return { expected, actual, status }
                }
            }
        ]
    },
    // {
    //     stage: "system-stats",
    //     assertions: [
    //         {
    //             name: "system-stats: validTopicEventsCount",
    //             description: "",
    //             assert: (input: any, metricOutput: any, topicOutput: any) => {
    //                 const expected = input.totalEventsInTransform
    //                 const actual = topicOutput.druidSystemStats
    //                 const status = expected === actual
    //                 return { expected, actual, status }
    //             }
    //         }
    //     ]
    // }
]


export async function assertCounts() {
    try {
        const eventsCount = await getAllEventsCount()
        const kafkaCounts = eventsCount.fetchedEventCounts;
        const topicOffsets = eventsCount.mergedCounts;
        const prometheusMetrics = await getMetrics()
        const matchedTransformEvent = await getEventById()
        console.log(matchedTransformEvent, "matched transform event")
        const response = _.map(assertionStages, (assertionStage: Record<string, any>) => {
            const { stage, assertions } = assertionStage;
            const assertionStatus = _.map(assertions, assertion => ({
                name: assertion.name,
                description: assertion.description || "",
                ...assertion.assert(inputCounts, prometheusMetrics, kafkaCounts)
            }))

            return {
                stage,
                assertions: assertionStatus

            }
        })

        const report = function runTests(testData: any): any {
            let passed = true;
            for (const stage of testData) {
                for (const assertion of stage.assertions) {
                    if (!assertion.status) {
                        passed = false;
                    }
                }
            }
            return { passed, stages: testData };
        }
        const payload = {
            topicOffsets: topicOffsets,
            metricsSummary: prometheusMetrics,
            finalReport: report(response)
        }
        fs.writeFileSync('./output.json', JSON.stringify(payload), 'utf-8');
    }
    catch (error: any) {
        console.error(error.message)
        return { isPassed: false, message: error.message }
    }
}