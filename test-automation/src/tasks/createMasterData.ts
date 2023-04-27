import masterDatasetPayload from '../data/requestPayload/masterDataset';
import { createMasterDataset } from '../services/dataset';

export default {
    index: 1,
    name: 'createMasterDataset',
    handler: (payloadFromPreviousTasks: Record<string, any>) => {
        return async () => {
            return createMasterDataset(masterDatasetPayload);
        }
    }
};
