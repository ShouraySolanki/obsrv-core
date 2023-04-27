import _ from 'lodash';

const env = process.env;

export default {
    OBS_API_SERVICE: _.get(env, 'OBS_API_SERVICE') || "http://localhost:4000",
    PROMETHEUS: _.get(env, 'PROMETHEUS') || "http://localhost:9090",
    POSTGRES_HOST: _.get(env, 'postgres_host') || 'localhost',
    POSTGRES_PORT: _.get(env,'postgres_port' ) || 5432,
    POSTGRES_USERNAME: _.get(env, 'postgres_username' ) || 'obsrv',
    POSTGRES_PASSWORD: _.get(env, 'postgres_password') || '5b-0b5rv',
    POSTGRES_DATABASE: _.get(env, 'postgres_database' ) || 'sb-obsrv',
}