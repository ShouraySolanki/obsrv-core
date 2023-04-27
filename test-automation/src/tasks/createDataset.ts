import datasetPayload from "../data/requestPayload/dataset";
import datasourcePayload from '../data/requestPayload/datasource'
import transformationPayload from '../data/requestPayload/transformation'
import { createDataset, saveDatasource, saveTransformations } from "../services/dataset";

const observationDatasetPayload = datasetPayload.observations
const observationDatasourcePayload = datasourcePayload.observations
const transformationPayloadMask = transformationPayload.observations.mask
const transformationPayloadEncrypt = transformationPayload.observations.encrypt
const transformationPayloadJsonataTimestampString = transformationPayload.observations.jsonata_timestampString
const transformationPayloadJsonataCodeComponentsValue = transformationPayload.observations.jsonata_codeComponentValues
const transformationPayloadJsonataCodecomponentsCount = transformationPayload.observations.jsonata_codeComponentsCount

export default {
    index: 1,
    name: 'createDataset',
    handler: (payloadFromPreviousTasks: Record<string, any>) => {
        return async () => {
            await createDataset(observationDatasetPayload)
            await saveDatasource({ data: observationDatasourcePayload, config: {} })
            await saveTransformations(transformationPayloadMask)
            await saveTransformations(transformationPayloadEncrypt)
            await saveTransformations(transformationPayloadJsonataTimestampString)
            await saveTransformations(transformationPayloadJsonataCodeComponentsValue)
            await saveTransformations(transformationPayloadJsonataCodecomponentsCount)
        }
    }
};
