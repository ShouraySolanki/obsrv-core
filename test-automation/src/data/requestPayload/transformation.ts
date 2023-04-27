import transformationFunctions from '../transformation_functions/dataset'
const observationsTransformationFunctions = transformationFunctions.observations

export default {
    "observations": {
        "mask": {
            "dataset_id": "observations-transformed.1",
            "field_key": "spatialExtent",
            "transformation_function": observationsTransformationFunctions.mask,
            "status": "DRAFT"
        },
        "encrypt": {
            "dataset_id": "observations-transformed.1",
            "field_key": "yMax",
            "transformation_function": observationsTransformationFunctions.encrypt,
            "status": "DRAFT"
        },
        "jsonata_timestampString": {
            "dataset_id": "observations-transformed.1",
            "field_key": "timestampString",
            "transformation_function": observationsTransformationFunctions.jsonata_timestampString,
            "status": "DRAFT"
        },
        "jsonata_codeComponentsCount": {
            "dataset_id": "observations-transformed.1",
            "field_key": "codeComponentsCount",
            "transformation_function": observationsTransformationFunctions.jsonata_codeComponentsCount,
            "status": "DRAFT"
        },
        "jsonata_codeComponentValues": {
            "dataset_id": "observations-transformed.1",
            "field_key": "codeComponentValues",
            "transformation_function": observationsTransformationFunctions.jsonata_codeComponentValues,
            "status": "DRAFT"

        }
    }
}