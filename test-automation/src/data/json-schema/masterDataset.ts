export default {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "format": "uuid",
            "suggestions": [
                {
                    "message": "The Property 'id' appears to be 'uuid' format type.",
                    "advice": "Suggest to not to index the high cardinal columns",
                    "resolutionType": "DEDUP",
                    "severity": "LOW"
                }
            ]
        },
        "assetName": {
            "type": "string"
        },
        "assetLocation": {
            "type": "string"
        }
    }
}