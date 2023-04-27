export default {
    "observations": {
        "type": "kafka",
        "spec": {
            "dataSchema": {
                "dataSource": "observations-transformed",
                "dimensionsSpec": {
                    "dimensions": [
                        {
                            "type": "string",
                            "name": "obsCode"
                        },
                        {
                            "type": "string",
                            "name": "codeComponents_componentCode"
                        },
                        {
                            "type": "string",
                            "name": "codeComponents_componentType"
                        },
                        {
                            "type": "string",
                            "name": "codeComponents_selector"
                        },
                        {
                            "type": "string",
                            "name": "codeComponents_value"
                        },
                        {
                            "type": "string",
                            "name": "codeComponents_valueUoM"
                        },
                        {
                            "type": "string",
                            "name": "valueUoM"
                        },
                        {
                            "type": "string",
                            "name": "value"
                        },
                        {
                            "type": "string",
                            "name": "id"
                        },
                        {
                            "type": "string",
                            "name": "parentCollectionRef"
                        },
                        {
                            "type": "string",
                            "name": "integrationAccountRef"
                        },
                        {
                            "type": "string",
                            "name": "assetRef"
                        },
                        {
                            "type": "number",
                            "name": "xMin"
                        },
                        {
                            "type": "number",
                            "name": "xMax"
                        },
                        {
                            "type": "number",
                            "name": "yMin"
                        },
                        {
                            "type": "number",
                            "name": "yMax"
                        },
                        {
                            "type": "string",
                            "name": "phenTime"
                        },
                        {
                            "type": "string",
                            "name": "phenEndTime"
                        },
                        {
                            "type": "string",
                            "name": "spatialExtent"
                        },
                        {
                            "type": "number",
                            "name": "modified"
                        },
                        {
                            "type": "json",
                            "name": "assetMeta"
                        },
                        {
                            "type": "json",
                            "name": "providerMeta"
                        },
                        {
                            "type": "string",
                            "name": "obsLocation"
                        },
                        {
                            "type": "string",
                            "name": "obsProvider"
                        },
                        {
                            "type": "string",
                            "name": "codeComponentsCount"
                        },
                        {
                            "type": "string",
                            "name": "codeComponentValues"
                        },
                        {
                            "type": "string",
                            "name": "timestampString"
                        }
                    ]
                },
                "timestampSpec": {
                    "column": "phenTime",
                    "format": "auto"
                },
                "metricsSpec": [],
                "granularitySpec": {
                    "type": "uniform",
                    "segmentGranularity": "DAY",
                    "rollup": false
                }
            },
            "tuningConfig": {
                "type": "kafka",
                "maxRowsPerSegment": 50000,
                "logParseExceptions": true
            },
            "ioConfig": {
                "type": "kafka",
                "topic": "observations-transformed",
                "consumerProperties": {
                    "bootstrap.servers": "kafka-headless.kafka.svc.cluster.local:9092"
                },
                "taskCount": 1,
                "replicas": 1,
                "taskDuration": "PT1H",
                "useEarliestOffset": false,
                "completionTimeout": "PT1H",
                "inputFormat": {
                    "type": "json",
                    "flattenSpec": {
                        "useFieldDiscovery": true,
                        "fields": [
                            {
                                "type": "path",
                                "expr": "$.obsCode",
                                "name": "obsCode"
                            },
                            {
                                "type": "path",
                                "expr": "$.codeComponents[*].componentCode",
                                "name": "codeComponents_componentCode"
                            },
                            {
                                "type": "path",
                                "expr": "$.codeComponents[*].componentType",
                                "name": "codeComponents_componentType"
                            },
                            {
                                "type": "path",
                                "expr": "$.codeComponents[*].selector",
                                "name": "codeComponents_selector"
                            },
                            {
                                "type": "path",
                                "expr": "$.codeComponents[*].value",
                                "name": "codeComponents_value"
                            },
                            {
                                "type": "path",
                                "expr": "$.codeComponents[*].valueUoM",
                                "name": "codeComponents_valueUoM"
                            },
                            {
                                "type": "path",
                                "expr": "$.valueUoM",
                                "name": "valueUoM"
                            },
                            {
                                "type": "path",
                                "expr": "$.value",
                                "name": "value"
                            },
                            {
                                "type": "path",
                                "expr": "$.id",
                                "name": "id"
                            },
                            {
                                "type": "path",
                                "expr": "$.parentCollectionRef",
                                "name": "parentCollectionRef"
                            },
                            {
                                "type": "path",
                                "expr": "$.integrationAccountRef",
                                "name": "integrationAccountRef"
                            },
                            {
                                "type": "path",
                                "expr": "$.assetRef",
                                "name": "assetRef"
                            },
                            {
                                "type": "path",
                                "expr": "$.xMin",
                                "name": "xMin"
                            },
                            {
                                "type": "path",
                                "expr": "$.xMax",
                                "name": "xMax"
                            },
                            {
                                "type": "path",
                                "expr": "$.yMin",
                                "name": "yMin"
                            },
                            {
                                "type": "path",
                                "expr": "$.yMax",
                                "name": "yMax"
                            },
                            {
                                "type": "path",
                                "expr": "$.phenTime",
                                "name": "phenTime"
                            },
                            {
                                "type": "path",
                                "expr": "$.phenEndTime",
                                "name": "phenEndTime"
                            },
                            {
                                "type": "path",
                                "expr": "$.spatialExtent",
                                "name": "spatialExtent"
                            },
                            {
                                "type": "path",
                                "expr": "$.modified",
                                "name": "modified"
                            },
                            {
                                "type": "path",
                                "expr": "$.assetMeta",
                                "name": "assetMeta"
                            },
                            {
                                "type": "path",
                                "expr": "$.providerMeta",
                                "name": "providerMeta"
                            },
                            {
                                "type": "path",
                                "expr": "$.obsLocation",
                                "name": "obsLocation"
                            },
                            {
                                "type": "path",
                                "expr": "$.obsProvider",
                                "name": "obsProvider"
                            },
                            {
                                "type": "path",
                                "expr": "$.codeComponentsCount",
                                "name": "codeComponentsCount"
                            },
                            {
                                "type": "path",
                                "expr": "$.codeComponentValues",
                                "name": "codeComponentValues"
                            },
                            {
                                "type": "path",
                                "expr": "$.timestampString",
                                "name": "timestampString"
                            }
                        ]
                    }
                },
                "appendToExisting": false
            }
        }
    }
}