import inputCounts from '../data/event-generate/inputCounts.json'
import chai from "chai";
import { getAllEventsCount } from './getCounts';
chai.should();
export async function assertCounts() {
    try {
        const kafkaCounts = await getAllEventsCount()
        inputCounts.totalEventsInIngest.should.be.eq(kafkaCounts.ingest)
        inputCounts.duplicateBatches.should.be.eq(kafkaCounts.extractor_duplicate)
        inputCounts.invalidBatches.should.be.eq(kafkaCounts.extractor_failed)
        inputCounts.totalEventsInRaw.should.be.eq(kafkaCounts.raw)
        inputCounts.invalidSchemaEvents.should.be.eq(kafkaCounts.invalid)
        inputCounts.duplicateEventsCount.should.be.eq(kafkaCounts.duplicate)
        inputCounts.totalEventsInUnique.should.be.eq(kafkaCounts.unique)
        inputCounts.failedDenormEvents.should.be.eq(kafkaCounts.denorm_failed)
        inputCounts.totalEventsInDenorm.should.be.eq(kafkaCounts.denorm)
        inputCounts.failedTransformEvents.should.be.eq(kafkaCounts.transform_failed)
        inputCounts.totalEventsInTransform.should.be.eq(kafkaCounts.transform)
        return { isPassed: true, message: "all assertions are passed" }

    }
    catch (error: any) {
        return { isPassed: false, message: error.message }
    }
}