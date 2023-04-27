export default {
    "observations": {
        "mask": { "type": "mask", "condition": null, "expr": "spatialExtent" },
        "encrypt": { "type": "encrypt", "condition": null, "expr": "yMax" },
        "jsonata_timestampString": { "type": "jsonata", "condition": null, "expr": "$fromMillis(modified)" },
        "jsonata_codeComponentsCount": { "type": "jsonata", "condition": null, "expr": "$count(codeComponents)" },
        "jsonata_codeComponentValues": { "type": "jsonata", "condition": null, "expr": "codeComponents.value" }
    }
}