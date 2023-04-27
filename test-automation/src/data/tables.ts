export const createQueries = [{
    "datasets": `CREATE TABLE IF NOT EXISTS datasets (
        id TEXT PRIMARY KEY,
        dataset_id TEXT,
        type TEXT NOT NULL,
        name TEXT,
        validation_config JSON,
        extraction_config JSON,
        dedup_config JSON,
        data_schema JSON,
        denorm_config JSON,
        router_config JSON,
        dataset_config JSON,
        status TEXT,
        created_by TEXT,
        updated_by TEXT,
        created_date TIMESTAMP NOT NULL DEFAULT now(),
        updated_date TIMESTAMP NOT NULL,
        published_date Date
    );`
},
{
    "datasets_draft": `CREATE TABLE IF NOT EXISTS datasets_draft (
        id TEXT PRIMARY KEY,
        dataset_id TEXT,
        version INTEGER NOT NULL,
        type TEXT NOT NULL,
        name TEXT,
        validation_config JSON,
        extraction_config JSON,
        dedup_config JSON,
        data_schema JSON,
        denorm_config JSON,
        router_config JSON,
        dataset_config JSON,
        client_state JSON,
        status TEXT,
        created_by TEXT,
        updated_by TEXT,
        created_date TIMESTAMP NOT NULL DEFAULT now(),
        updated_date TIMESTAMP NOT NULL,
        published_date Date,
        UNIQUE (dataset_id, version)
    );`
},
{
"datasources": `CREATE TABLE IF NOT EXISTS datasources (
    id TEXT PRIMARY KEY,
    datasource text NOT NULL,
    dataset_id TEXT NOT NULL REFERENCES datasets (id),
    ingestion_spec json NOT NULL,
    datasource_ref text NOT NULL,
    retention_period json,
    archival_policy json,
    purge_policy json,
    backup_config json NOT NULL,
    status text NOT NULL,
    created_by text NOT NULL,
    updated_by text NOT NULL,
    created_date Date NOT NULL DEFAULT now(),
    updated_date Date NOT NULL,
    published_date Date,
    UNIQUE (dataset_id, datasource)
  );`},
  {
  "datasources_draft": `CREATE TABLE IF NOT EXISTS datasources_draft (
    id TEXT PRIMARY KEY,
    datasource text NOT NULL,
    dataset_id TEXT NOT NULL REFERENCES datasets_draft (id),
    ingestion_spec json NOT NULL,
    datasource_ref text NOT NULL,
    retention_period json,
    archival_policy json,
    purge_policy json,
    backup_config json NOT NULL,
    status text NOT NULL,
    created_by text NOT NULL,
    updated_by text NOT NULL,
    created_date Date NOT NULL DEFAULT now(),
    updated_date Date NOT NULL,
    published_date Date,
    UNIQUE (dataset_id, datasource)
  );`},
{
    "dataset_source_config": `CREATE TABLE IF NOT EXISTS dataset_source_config (
        id TEXT PRIMARY KEY,
        dataset_id TEXT NOT NULL REFERENCES datasets (id),
        connector_type text NOT NULL,
        connector_config json NOT NULL,
        status text NOT NULL,
        connector_stats json,
        created_by text NOT NULL,
        updated_by text NOT NULL,
        created_date Date NOT NULL DEFAULT now(),
        updated_date Date NOT NULL,
        published_date Date,
        UNIQUE (dataset_id)
      );
      `
},
{
    "dataset_source_config_draft": `CREATE TABLE IF NOT EXISTS dataset_source_config_draft (
        id TEXT PRIMARY KEY,
        dataset_id TEXT NOT NULL REFERENCES datasets_draft (id),
        connector_type text NOT NULL,
        connector_config json NOT NULL,
        status text NOT NULL,
        connector_stats json,
        created_by text NOT NULL,
        updated_by text NOT NULL,
        created_date Date NOT NULL DEFAULT now(),
        updated_date Date NOT NULL,
        published_date Date,
        UNIQUE (dataset_id)
      );`
},
{
    "dataset_transformations": `CREATE TABLE IF NOT EXISTS dataset_transformations (
        id TEXT PRIMARY KEY,
        dataset_id TEXT NOT NULL REFERENCES datasets (id),
        field_key TEXT NOT NULL,
        transformation_function TEXT,
        status TEXT NOT NULL,
        created_by TEXT NOT NULL,
        updated_by TEXT NOT NULL,
        created_date DATE NOT NULL DEFAULT now(),
        updated_date DATE NOT NULL,
        published_date Date,
        UNIQUE (dataset_id, field_key)
      );`
},
{
"dataset_transformations_draft": `CREATE TABLE IF NOT EXISTS dataset_transformations_draft (
    id TEXT PRIMARY KEY,
    dataset_id TEXT NOT NULL REFERENCES datasets_draft (id),
    field_key TEXT NOT NULL,
    transformation_function TEXT,
    status TEXT NOT NULL,
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    created_date DATE NOT NULL DEFAULT now(),
    updated_date DATE NOT NULL,
    published_date Date,
    UNIQUE (dataset_id, field_key)
  );`
},
{
    "redis_db_index": `create sequence redis_db_index start 3;`
}
]