import masterDatasetPayload from '../data/requestPayload/masterDataset';
import masterDatasourcePayload from '../data/requestPayload/masterDatasource';
import { createMasterDataset, saveDatasource } from '../services/dataset';

const observationDatasetPayload = masterDatasetPayload.observations;
const observationDatasourcePayload = masterDatasourcePayload.observations

export default {
    index: 1,
    name: 'createMasterDataset',
    handler: (payloadFromPreviousTasks: Record<string, any>) => {
        return async () => {
            await createMasterDataset(observationDatasetPayload);
            await saveDatasource(observationDatasourcePayload);
        }
    }
};
