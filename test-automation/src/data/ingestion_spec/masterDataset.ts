export default {
    "observations": { "type": "kafka", "spec": { "dataSchema": { "dataSource": "observations-assets", "dimensionsSpec": { "dimensions": [{ "type": "string", "name": "id" }, { "type": "string", "name": "assetName" }, { "type": "string", "name": "assetLocation" }] }, "timestampSpec": { "column": "syncts", "format": "auto" }, "metricsSpec": [], "granularitySpec": { "type": "uniform", "segmentGranularity": "DAY", "rollup": false } }, "tuningConfig": { "type": "kafka", "maxRowsPerSegment": 50000, "logParseExceptions": true }, "ioConfig": { "type": "kafka", "topic": "observations-assets", "consumerProperties": { "bootstrap.servers": "kafka-headless.kafka.svc.cluster.local:9092" }, "taskCount": 1, "replicas": 1, "taskDuration": "PT1H", "useEarliestOffset": false, "completionTimeout": "PT1H", "inputFormat": { "type": "json", "flattenSpec": { "useFieldDiscovery": true, "fields": [{ "type": "path", "expr": "$.id", "name": "id" }, { "type": "path", "expr": "$.assetName", "name": "assetName" }, { "type": "path", "expr": "$.assetLocation", "name": "assetLocation" }] } }, "appendToExisting": false } } }
}