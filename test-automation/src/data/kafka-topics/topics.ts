const job_env = process.env.system_env || 'dev'

export const masterTopics = {
    ingest: `${job_env}.masterdata.ingest`,
    raw: `${job_env}.masterdata.raw`,
    extractor_failed: `${job_env}.masterdata.extractor.failed`,

    extractor_duplicate: `${job_env}.masterdata.extractor.duplicate`,
    unique: `${job_env}.masterdata.unique`,
    duplicate: `${job_env}.masterdata.duplicate`,
    transform: `${job_env}.masterdata.transform`,
}

export const datasetTopics = {
    ingest: `${job_env}.ingest`,
    raw: `${job_env}.raw`,
    extractor_failed: `${job_env}.extractor.failed`,
    extractor_duplicate: `${job_env}.extractor.duplicate`,
    unique: `${job_env}.unique`,
    duplicate: `${job_env}.duplicate`,
    invalid: `${job_env}.invalid`,
    denorm: `${job_env}.denorm`,
    denorm_failed: `${job_env}.denorm.failed`,
    transform: `${job_env}.transform`,
    transform_failed: `${job_env}.transform.failed`
}