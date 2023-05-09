import axios from 'axios';
import config from '../config/index'
import apiEndpoints from '../data/apiEndpoints';

const http = axios.create({ baseURL: `http://${config.DRUID_HOST}:${config.DRUID_PORT}` });


export const fetchRecords = async (payload: any) => {
    const response = await http.post("/druid/v2", payload, {})
    return response
}