import _ from 'lodash';

const env = process.env;

export default {
    OBS_API_SERVICE: _.get(env, 'OBS_API_SERVICE') || "http://localhost:4000",
    PROMETHEUS: _.get(env, 'PROMETHEUS') || "http://localhost:9090",
}