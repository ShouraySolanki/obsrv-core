import jsonSchemas from '../json-schema/dataset';
const observationJsonSchema = jsonSchemas.observations

export default {
    "observations": {
        "dataset_id": "observations-transformed",
        "type": "dataset",
        "name": "observations-transformed",
        "validation_config": { "validate": true, "mode": "Strict", "validation_mode": "Strict" },
        "extraction_config": { "is_batch_event": true, "extraction_key": "events", "dedup_config": { "drop_duplicates": true, "dedup_key": "id", "dedup_period": 720 }, "batch_id": "id" },
        "dedup_config": { "drop_duplicates": true, "dedup_key": "id", "dedup_period": 720 },
        "data_schema": observationJsonSchema,
        "denorm_config": { "redis_db_host": "obsrv-redis-headless.redis.svc.cluster.local", "redis_db_port": 6379, "denorm_fields": [{ "denorm_key": "assetRef", "redis_db": 3, "denorm_out_field": "assetMeta" }, { "denorm_key": "integrationAccountRef", "redis_db": 4, "denorm_out_field": "providerMeta" }] },
        "router_config": { "topic": "observations-transformed" },
        "dataset_config": { "data_key": "", "timestamp_key": "phenTime", "exclude_fields": [], "entry_topic": "dev.ingest", "redis_db_host": "obsrv-redis-headless.redis.svc.cluster.local", "redis_db_port": 6379, "index_data": true, "redis_db": 0 },
        "status": "DRAFT",
        "client_state": {}
    }
}