const { sendRequest } = require("./helpers/api");
const uuid = require("uuid");
const fs = require("fs");
const { generateObsEvent, generateObsEventWithAddFields, generateObsInvalidEvent, generateMasterEvents } = require("./helpers/data");
const { INTEGRATION_ACCOUNT_REF } = require("./resources/mocks");

let successCount = 0,
  failedCount = 0;
let duplicateBatchIds = [];

Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};
let jsonData = [];

const pushBatchEvents = (eventsCount, type) => {
  //   let obsCollectionEvent = []
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
  };

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

  return sendRequest({ body })
    .then((res) => {
      successCount++;
      console.log(`Success ${successCount}`);
    })
    .catch((error) => {
      failedCount++;
      console.log(`Failure ${failedCount}`);
      console.log("Failure", error.message);
    });
};

const pushBatchData = async (totalBatches) => {
  const startTime = Date.now();
  const duplicateBatchCount = totalBatches / 10,
    invalidSchemaCount = totalBatches / 25,
    addFieldsCount = totalBatches / 25, //
    invalidEventsKeyCount = totalBatches / 10,
    missingBatchIdCount = totalBatches / 10;

  const validBatchCount = totalBatches - ((duplicateBatchCount * 2) + invalidSchemaCount + addFieldsCount + invalidEventsKeyCount + missingBatchIdCount);

  console.log(duplicateBatchCount * 2, invalidSchemaCount, addFieldsCount, invalidEventsKeyCount, missingBatchIdCount, validBatchCount)
  let promises = []
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
  await Promise.all(promises)
  const endTime = Date.now();
  console.log("Time Taken to push batch data", endTime - startTime);
  console.log("Success Count", successCount);
  console.log("Failed Count", failedCount);
};

(async function () {
  // Push data to functionally test the pipeline
  pushBatchData(50); // Push 50 batches = 5k events

  // Push data to mini benchmark the pipeline
  // pushBatchData(10000) // Push 10k batches = 1M events
  // pushBatchData(100000) // Push 100k batches = 10M events
  // pushBatchData(1000000) // Push 1M batches = 100M events
})();
