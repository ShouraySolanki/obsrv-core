import inputCounts from '../reports/inputCounts.json'
import chai from "chai";
import * as _ from 'lodash'
import { getMetrics } from './getMetrics';
import { getAllEventsCount, getEventById } from './getCounts';
import { previewTransformation } from './transfomation';
import { transformFields } from '../data/transformation_functions/transformFields';
import { datasetTopics } from '../data/kafka-topics/topics';
import { maskField } from './maskFunction';
import fs from 'fs';

chai.should();

const assertionStages = [
    {
        stage: "ingestion",
        assertions: [
            {
                name: "prometheus: inputCountMatch",
                description: "This test is to verify the ingested batch count",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
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
            },
            {
                name: "kafka: validateTransformedEvent",
                description: "This test is to verify the fields in kafka event after transform job - jsonata",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = topicOutput.transformEvent.jsonata1.expected
                    const actual = topicOutput.transformEvent.jsonata1.actual
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateTransformedEvent",
                description: "This test is to verify the fields in kafka event after transform job - jsonata",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = topicOutput.transformEvent.jsonata2.expected
                    const actual = topicOutput.transformEvent.jsonata2.actual
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateTransformedEvent",
                description: "This test is to verify the fields in kafka event after transform job - jsonata",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = topicOutput.transformEvent.jsonata3.expected
                    const actual = topicOutput.transformEvent.jsonata3.actual
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateTransformedEvent",
                description: "This test is to verify the fields in kafka event after transform job - jsonata",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = topicOutput.transformEvent.jsonata4.expected
                    const actual = topicOutput.transformEvent.jsonata4.actual
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateTransformedEvent",
                description: "This test is to verify the fields in kafka event after transform job - jsonata",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = topicOutput.transformEvent.jsonata5.expected
                    const actual = topicOutput.transformEvent.jsonata5.actual
                    const status = expected === actual
                    return { expected, actual, status }
                }
            },
            {
                name: "kafka: validateTransformedEvent",
                description: "This test is to verify the fields in kafka event after transform job - mask",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = topicOutput.transformEvent.mask.expected
                    const actual = topicOutput.transformEvent.mask.actual
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
    {
        stage: "system-stats",
        assertions: [
            {
                name: "system-stats: validTopicEventsCount",
                description: "",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.totalEventsInTransform
                    const actual = topicOutput.druidSystemStats
                    const status = expected === actual
                    return { expected, actual, status }
                }
            }
        ]
    },
    {
        stage: "druid-ingestion",
        assertions: [
            {
                name: "druid: RecordCount",
                description: "",
                assert: (input: any, metricOutput: any, topicOutput: any) => {
                    const expected = input.totalEventsInTransform
                    const actual = topicOutput.datasetRecordCount
                    const status = expected === actual
                    return { expected, actual, status }
                }
            }
        ]
    }
]


export async function assertCounts() {
    try {
        const eventsCount = await getAllEventsCount()
        let kafkaOutputs = eventsCount.fetchedEventCounts;
        const topicOffsets = eventsCount.mergedCounts;
        const prometheusMetrics = await getMetrics()
        const matchedDenormEvent: any = await getEventById(datasetTopics.denorm)
        const matchedTransformEvent: any = await getEventById(datasetTopics.transform)
        Object.assign(kafkaOutputs, { "transformEvent": await validateTransforms(matchedTransformEvent, matchedDenormEvent) })
        const response = _.map(assertionStages, (assertionStage: Record<string, any>) => {
            const { stage, assertions } = assertionStage;
            const assertionStatus = _.map(assertions, assertion => ({
                name: assertion.name,
                description: assertion.description || "",
                ...assertion.assert(inputCounts, prometheusMetrics, kafkaOutputs)
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
            ts: Date.now(),
            topicOffsets: topicOffsets,
            metricsSummary: prometheusMetrics,
            finalReport: report(response)
        }
        fs.writeFileSync(__dirname + `/../reports/report.json`, JSON.stringify(payload), 'utf-8');
        return true
    }
    catch (error: any) {
        console.error(error.message)
        return { isPassed: false, message: error.message }
    }
}

export async function validateTransforms(matchedTransformEvent: any, matchedDenormEvent: any) {
    let result: any = {}
    result.mask = {
        "expected": maskField(matchedDenormEvent.spatialExtent),
        "actual": matchedTransformEvent.spatialExtent
    }
    result.jsonata1 = {
        "expected": await previewTransformation(transformFields.jsonata1.expression, matchedTransformEvent),
        "actual": matchedTransformEvent[transformFields.jsonata1.outputField],
    }
    result.jsonata2 = {
        "expected": await previewTransformation(transformFields.jsonata2.expression, matchedTransformEvent),
        "actual": matchedTransformEvent[transformFields.jsonata2.outputField],
    }
    result.jsonata3 = {
        "expected": await previewTransformation(transformFields.jsonata3.expression, matchedTransformEvent),
        "actual": matchedTransformEvent[transformFields.jsonata3.outputField],
    }
    result.jsonata4 = {
        "expected": await previewTransformation(transformFields.jsonata4.expression, matchedTransformEvent),
        "actual": matchedTransformEvent[transformFields.jsonata4.outputField],
    }
    result.jsonata5 = {
        "expected": JSON.stringify(await previewTransformation(transformFields.jsonata5.expression, matchedTransformEvent)),
        "actual": JSON.stringify(matchedTransformEvent[transformFields.jsonata5.outputField]),
    }
    return result
}