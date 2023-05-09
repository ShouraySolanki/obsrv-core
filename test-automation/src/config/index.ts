import _ from 'lodash';

const env = process.env;

export default {
    OBS_API_SERVICE: _.get(env, 'obs_api_service_host') || "http://localhost:3000",
    PROMETHEUS: _.get(env, 'prometheus') || "http://localhost:9090",
    POSTGRES_HOST: _.get(env, 'postgres_host') || 'localhost',
    POSTGRES_PORT: _.get(env, 'postgres_port') || "5432",
    POSTGRES_USERNAME: _.get(env, 'postgres_username') || 'obsrv',
    POSTGRES_PASSWORD: _.get(env, 'postgres_password') || '5b-0b5rv',
    POSTGRES_DATABASE: _.get(env, 'postgres_database') || 'sb-obsrv',
    DRUID_HOST: _.get(env, 'druid_host') || 'localhost',
    DRUID_PORT: _.get(env, 'druid_port') || "8888",
}