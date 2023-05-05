import axios from 'axios';
import config from '../config/index'
import apiEndpoints from '../data/apiEndpoints';

const http = axios.create({ baseURL: config.PROMETHEUS });

export const fetchMetrics = async (payload: any) => {
    const response = await http.get(apiEndpoints.fetchMetrics, { params: { query: payload } })
    return response.data.data.result[0].value[1]
}