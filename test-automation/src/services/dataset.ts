
import * as _ from 'lodash';
import axios from 'axios';
import apiEndpoints from '../data/apiEndpoints';
import config from '../config/index'

const http = axios.create({ baseURL: config.OBS_API_SERVICE });

const saveDataset = ({ data = {}, config, master }: any) => {
    return http.post(apiEndpoints.saveDatset, data, config);
}

export const datasetRead = ({ datasetId, config = {} }: any) => {
    return http.get(`${apiEndpoints.readDataset}/${datasetId}`, {
        ...config
    })
}

export const saveTransformations = async (payload: any) => {
    return http.post(`${apiEndpoints.transformationsConfig}`, payload, {});
}

export const sendEvents = async (datasetId: string, payload: any) => {
    return await http.post(`${apiEndpoints.sendEvents}/${datasetId}`, { "data": payload }, {});
}

export const updateDenormConfig = async (denormPayload: any) => {
    return await http.patch(apiEndpoints.saveDatset, denormPayload, {});
}

export const createMasterDataset = (payload: Record<string, any>) => {
    return saveDataset({ data: payload, config: {} });
}

export const createDataset = (payload: Record<string, any>) => {
    return saveDataset({ data: payload, config: {} });
}

export const saveDatasource = ({ data, config }: any) => {
    return http.post(apiEndpoints.saveDatasource, data, config);
}

export const publishDataset = ({ data, config }: any) => {
    return http.post(apiEndpoints.publishDataset, data, config);
}