
import * as _ from 'lodash';
import http from 'axios';
import apiEndpoints from '../data/apiEndpoints';

export const saveDataset = ({ data = {}, config, master }: any) => {
    return http.post(apiEndpoints.saveDatset, data, config);
}

export const datasetRead = ({ datasetId, config = {} }: any) => {
    return http.get(`${apiEndpoints.readDataset}/${datasetId}`, {
        ...config
    })
}

export const generateIngestionSpec = ({ data, config }: any) => {
    return http.post(apiEndpoints.generateIngestionSpec, data, config);
}

export const saveTransformations = async (payload: any) => {
    return http.post(`${apiEndpoints.transformationsConfig}`, payload);
}

export const sendEvents = (datasetId: string | undefined, payload: any) => {
    return http.post(`${apiEndpoints.sendEvents}/${datasetId}`, payload, {});
}

export const saveConnectorDraft = async (payload: any) => {
    return http.post(`${apiEndpoints.datasetSourceConfig}`, payload);
}

export const updateDenormConfig = async (denormPayload: any) => {
    return await http.patch(apiEndpoints.saveDatset, denormPayload, {});
}
