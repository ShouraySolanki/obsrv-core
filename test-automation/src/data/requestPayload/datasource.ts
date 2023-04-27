import ingestionSpecs from '../ingestion_spec/dataset';
const observationIngestionSpec = ingestionSpecs.observations

export default {
    "observations": {
        "dataset_id": "observations-transformed.1",
        "ingestion_spec": observationIngestionSpec,
        "datasource": "observations-transformed.1_DAY",
        "datasource_ref": "observations-transformed.1_DAY",
        "retention_period": { "enabled": "false" },
        "archival_policy": { "enabled": "false" },
        "purge_policy": { "enabled": "false" },
        "backup_config": { "enabled": "false" },
        "status": "DRAFT"
    }
}