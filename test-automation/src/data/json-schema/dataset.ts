export default {
    "observations": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "title": "Canonical Observations",
        "description": "A canonical observation ",
        "type": "object",
        "properties": {
            "obsCode": {
                "type": "string"
            },
            "codeComponents": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "componentCode": {
                            "type": "string"
                        },
                        "componentType": {
                            "type": "string",
                            "enum": [
                                "AGG_TIME_WINDOW",
                                "AGG_METHOD",
                                "PARAMETER",
                                "FEATURE_OF_INTEREST",
                                "OBS_PROPERTY",
                                "SAMPLING_STRATEGY",
                                "OBS_METHOD",
                                "METADATA",
                                "METADATA_DEVICE",
                                "DATA_QUALITY",
                                "EVENT",
                                "FOI_CONTEXT"
                            ]
                        },
                        "selector": {
                            "type": "string"
                        },
                        "value": {
                            "type": "string"
                        },
                        "valueUoM": {
                            "type": "string"
                        }
                    }
                }
            },
            "valueUoM": {
                "type": "string"
            },
            "value": {
                "type": "string"
            },
            "id": {
                "type": "string"
            },
            "parentCollectionRef": {
                "type": "string"
            },
            "integrationAccountRef": {
                "type": "string"
            },
            "assetRef": {
                "type": "string"
            },
            "xMin": {
                "type": "number"
            },
            "xMax": {
                "type": "number"
            },
            "yMin": {
                "type": "number"
            },
            "yMax": {
                "type": "number"
            },
            "phenTime": {
                "type": "string",
                "format": "date-time",
                "suggestions": [
                    {
                        "message": "The Property 'phenTime' appears to be 'date-time' format type.",
                        "advice": "The System can index all data on this column",
                        "resolutionType": "INDEX",
                        "severity": "LOW"
                    }
                ]
            },
            "phenEndTime": {
                "type": "string",
                "format": "date - time",
                "suggestions": [
                    {
                        "message": "The Property 'phenEndTime' appears to be 'date-time' format type.",
                        "advice": "The System can index all data on this column",
                        "resolutionType": "INDEX",
                        "severity": "LOW"
                    }
                ]
            },
            "spatialExtent": {
                "type": "string"
            },
            "modified": {
                "type": "number"
            }
        },
        "required": [
            "id",
            "parentCollectionRef",
            "integrationAccountRef",
            "obsCode",
            "phenTime",
            "value"
        ]
    }
}