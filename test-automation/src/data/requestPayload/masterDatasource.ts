import ingestionSpecs from '../ingestion_spec/masterDataset';

const observationIngestionSpecs = ingestionSpecs.observations;

export default {
    "observations": {
        "datasource": "observations-assets.1_DAY",
        "dataset_id": "observations-assets.1",
        "ingestion_spec": observationIngestionSpecs,
        "datasource_ref": "observations-assets.1_DAY",
        "retention_period": { "enabled": "false" },
        "archival_policy": { "enabled": "false" },
        "purge_policy": { "enabled": "false" },
        "backup_config": { "enabled": "false" },
        "status": "DRAFT"
    }
}