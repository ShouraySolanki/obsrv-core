import jsonSchemas from '../json-schema/masterDataset';

const observationJsonSchema = jsonSchemas.observations

export default {
    "observations": {
        "dataset_id": "observations-assets",
        "type": "master-dataset",
        "name": "observations-assets",
        "validation_config": { "validate": true, "mode": "Strict", "validation_mode": {} },
        "extraction_config": { "is_batch_event": false, "extraction_key": "", "dedup_config": { "drop_duplicates": true, "dedup_key": "id", "dedup_period": 3 } },
        "dedup_config": { "drop_duplicates": true, "dedup_key": "id", "dedup_period": 3 },
        "data_schema": observationJsonSchema,
        "denorm_config": { "redis_db_host": "obsrv-redis-headless.redis.svc.cluster.local", "redis_db_port": 6379 },
        "router_config": { "topic": "observations-assets" },
        "dataset_config": { "data_key": "id", "timestamp_key": "", "exclude_fields": [], "entry_topic": "dev.masterdata.ingest", "redis_db_host": "obsrv-redis-headless.redis.svc.cluster.local", "redis_db_port": 6379, "index_data": false, "redis_db": 3 },
        "status": "DRAFT",
        "client_state": {}
    }
}