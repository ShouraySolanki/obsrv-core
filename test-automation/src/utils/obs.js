const uuid = require("uuid");
const fs = require("fs");
var os = require("os");
const { generateObsEvent, generateObsEventWithAddFields, generateObsInvalidEvent, generateMasterEvents } = require("./dataGenerator");
const { INTEGRATION_ACCOUNT_REF, observationsDataset } = require("../data/event-generate/obsMeta");
const { sendEvents } = require("../services/dataset");
const async = require("async");
const _ = require("lodash");
const { count } = require("console");
let successCount = 0,
  failedCount = 0,
  successBatchCount = 0,
  failedBatchCount = 0;
let duplicateBatchIds = [];

Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};
const pushBatchEvents = (eventsCount, type) => {
  let obsEventArray = [];

  for (let i = 0; i < eventsCount; i++) {
    switch (type) {
      case "invalid":
        obsEventArray.push(generateObsInvalidEvent(INTEGRATION_ACCOUNT_REF.sample()));
        break;
      case "additional-fields":
        obsEventArray.push(generateObsEventWithAddFields(INTEGRATION_ACCOUNT_REF.sample()));
        break;
      default:
        obsEventArray.push(generateObsEvent(INTEGRATION_ACCOUNT_REF.sample()));
        break;
    }
  }

  let body = undefined;
  switch (type) {
    case "empty-dataset":
      body = { id: uuid.v4(), events: obsEventArray };
      break;
    case "incorrect-events-key":
      body = { id: uuid.v4(), eventxyz: obsEventArray };
      break;
    case "missing-batch-id":
      body = { events: obsEventArray };
      break;
    case "record-ids-for-duplicate-test":
      body = { id: uuid.v4(), events: obsEventArray };
      duplicateBatchIds.push(body.id);
      break;
    case "duplicate":
      body = { id: duplicateBatchIds.pop(), events: obsEventArray };
      break;
    default:
      body = { id: uuid.v4(), events: obsEventArray };
      break;
  }
  return () =>
    sendEvents(observationsDataset, body)
      .then((res) => {
        successCount++;
        console.log(`Success ${successCount}`);
      })
      .catch((error) => {
        failedCount++;
        console.log(`Failure ${failedCount}`);
      });
};

const makeAsyncBatchCallsv2 = (tasks) => {
  return async.eachLimit(tasks, 10, async (batch) => {
    try {
      await batch();
    } catch (error) {
      console.log(error);
    }
  });
};

const pushBatchData = async (totalBatches) => {
  const startTime = Date.now();
  console.log(`Start time - ${startTime}`);
  const duplicateBatchCount = totalBatches / 10,
    invalidSchemaCount = totalBatches / 25,
    addFieldsCount = totalBatches / 25, //
    invalidEventsKeyCount = totalBatches / 10,
    missingBatchIdCount = totalBatches / 10;
  const validBatchCount = totalBatches - (duplicateBatchCount * 2 + invalidSchemaCount + addFieldsCount + invalidEventsKeyCount + missingBatchIdCount);
  console.log(duplicateBatchCount * 2, invalidSchemaCount, addFieldsCount, invalidEventsKeyCount, missingBatchIdCount, validBatchCount);
  let counts = {};
  (counts.totalBatches = totalBatches), (counts.eventsInABatch = 100), (counts.duplicateBatches = duplicateBatchCount), (counts.invalidSchemaEvents = invalidSchemaCount * 100), (counts.invalidBatches = invalidEventsKeyCount), (counts.duplicateEventsCount = 0);
  await setInputCounts(counts);
  let promises = [];
  //1. 20 batch events with 100 records
  for (let i = 0; i < duplicateBatchCount; i++) {
    promises.push(pushBatchEvents(100, "record-ids-for-duplicate-test"));
  }
  for (let i = 0; i < validBatchCount; i++) {
    promises.push(pushBatchEvents(100, "valid"));
  }

  //2. 1 batch record with 100 records each with invalid schema
  for (let i = 0; i < invalidSchemaCount; i++) {
    promises.push(pushBatchEvents(100, "invalid"));
  }

  //1 batch record with 100 records with additional fields
  for (let i = 0; i < addFieldsCount; i++) {
    promises.push(pushBatchEvents(100, "additional-fields"));
  }

  // 4 batch records with no "dataset" id
  // TODO: Unable to test now as dataset_id is hardcoded in the URL

  // 6 batch records with no "events"/invalid key
  for (let i = 0; i < invalidEventsKeyCount; i++) {
    promises.push(pushBatchEvents(100, "incorrect-events-key"));
  }

  // 5 batch records with no batch id
  for (let i = 0; i < missingBatchIdCount; i++) {
    promises.push(pushBatchEvents(100, "missing-batch-id"));
  }

  // 10 batch records with duplicate batch id
  for (let i = 0; i < duplicateBatchCount; i++) {
    promises.push(pushBatchEvents(100, "duplicate"));
  }

  return makeAsyncBatchCallsv2(promises, 50).finally(() => {
    const endTime = Date.now();
    console.log(`End time - ${endTime}`);
    console.log("Time Taken to push batch data", endTime - startTime);
    console.log("Success Count", successCount);
    console.log("Failed Count", failedCount);
    console.log("Valid Events Count", (duplicateBatchCount + validBatchCount + addFieldsCount + missingBatchIdCount) * 100);
    console.log("Duplicate Batch Events Count", duplicateBatchCount);
    console.log("InValid Events Count", invalidSchemaCount * 100);
    console.log("Invalid Batch Events Count", invalidEventsKeyCount);
  });
};

const setInputCounts = async (counts) => {
  const { totalBatches, duplicateBatches, invalidSchemaEvents, invalidBatches, eventsInABatch, duplicateEventsCount } = counts;
  counts.failedDenormEvents = 0;
  counts.failedTransformEvents = 0;
  counts.totalEventsInIngest = totalBatches * eventsInABatch;
  counts.validBatches = totalBatches - (duplicateBatches + invalidBatches);
  counts.totalEventsInRaw = counts.validBatches * eventsInABatch;
  counts.totalEventsInUnique = counts.totalEventsInRaw - (duplicateEventsCount + invalidSchemaEvents);
  counts.totalEventsInDenorm = counts.totalEventsInUnique - counts.failedDenormEvents;
  counts.totalEventsInTransform = counts.totalEventsInDenorm - counts.failedTransformEvents;
  counts.totalEventsInRouterTopic = counts.totalEventsInTransform;
  fs.writeFileSync(__dirname + "/../reports/inputCounts.json", JSON.stringify(counts));
};

const pushObsEvents = async (batchSize) => pushBatchData(batchSize);

module.exports = { pushObsEvents };
