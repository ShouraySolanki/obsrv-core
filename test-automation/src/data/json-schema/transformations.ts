export default {
    "observations_mask": {
        "dataset_id": "observations-transformed.1",
        "field_key": "spatialExtent",
        "transformation_function": {"type":"mask","condition":null,"expr":"spatialExtent"},
        "status": "DRAFT"
    },
    "observations_encrypt": {
        "dataset_id": "observations-transformed.1",
        "field_key": "yMax",
        "transformation_function": {"type":"encrypt","condition":null,"expr":"yMax"},
        "status": "DRAFT"
    }
}