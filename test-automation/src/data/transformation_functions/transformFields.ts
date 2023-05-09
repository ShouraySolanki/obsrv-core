export const transformFields = {
    "mask": {
        "expression": "spatialExtent",
        "outputField": "spatialExtent"
    },
    "jsonata1": {
        "expression": "assetMeta.assetLocation & \" \" & assetMeta.assetName",
        "outputField": "obsLocation"
    },
    "jsonata2": {
        "expression": "providerMeta.value & \" \" & providerMeta.code",
        "outputField": "obsProvider"
    },
    "jsonata3":{
        "expression": "$count(codeComponents)",
        "outputField": "codeComponentsCount"
    },
    "jsonata4":{
        "expression": "$fromMillis(modified)",
        "outputField": "timestampString"
    },
    "jsonata5":{
        "expression": "codeComponents.value",
        "outputField": "codeComponentValues"
    },
    "encrypt": {
        "expression": "yMax",
        "outputField": "yMax"
    }
}