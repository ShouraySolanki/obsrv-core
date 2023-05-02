const { sendRequest, sendEvents } = require("./helpers/api");
const uuid = require("uuid");
const fs = require("fs");
const { generateObsEvent, generateObsEventWithAddFields, generateObsInvalidEvent, generateMasterEvents } = require("./helpers/data");
const { INTEGRATION_ACCOUNT_REF } = require("./resources/mocks");
const async = require("async");
const _ = require("lodash");

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
    // sendRequest({ body })
    sendEvents({ body })
      .then((res) => {
        successCount++;
        console.log(`Success ${successCount}`);
      })
      .catch((error) => {
        failedCount++;
        console.log(`Failure ${failedCount}`);
      });
};

const makeAsyncBatchCalls = (promises, limit) => {
  const tasks = promises.map((promise) => (cb) => {
    return promise
      .then((response) => {
        cb(null, response);
      })
      .catch((err) => {
        cb(err, null);
      });
  });

  return async.parallelLimit(tasks, limit);
};

const makeAsyncBatchCallsv2 = (tasks) => {
  // Define the batch size and concurrency limit

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
  let promises = [];
  //1. 20 batch events with 100 records
  for (let i = 0; i < duplicateBatchCount; i++) {
    promises.push(pushBatchEvents(100, "record-ids-for-duplicate-test"));
    if (promises.length % 500 === 0) {
      await makeAsyncBatchCallsv2(promises);
      promises = [];
    }
  }
  await makeAsyncBatchCallsv2(promises);

  promises = [];
  for (let i = 0; i < validBatchCount; i++) {
    promises.push(pushBatchEvents(100, "valid"));
    if (promises.length % 1000 === 0) {
      await makeAsyncBatchCallsv2(promises);
      promises = [];
    }
  }
  await makeAsyncBatchCallsv2(promises);

  //2. 1 batch record with 100 records each with invalid schema
  promises = [];
  for (let i = 0; i < invalidSchemaCount; i++) {
    promises.push(pushBatchEvents(100, "invalid"));
    if (promises.length % 1000 === 0) {
      await makeAsyncBatchCallsv2(promises);
      promises = [];
    }
  }
  await makeAsyncBatchCallsv2(promises);

  //1 batch record with 100 records with additional fields
  promises = [];
  for (let i = 0; i < addFieldsCount; i++) {
    promises.push(pushBatchEvents(100, "additional-fields"));
    if (promises.length % 1000 === 0) {
      await makeAsyncBatchCallsv2(promises);
      promises = [];
    }
  }
  await makeAsyncBatchCallsv2(promises);

  // 4 batch records with no "dataset" id
  // TODO: Unable to test now as dataset_id is hardcoded in the URL

  // 6 batch records with no "events"/invalid key
  promises = [];
  for (let i = 0; i < invalidEventsKeyCount; i++) {
    promises.push(pushBatchEvents(100, "incorrect-events-key"));
    if (promises.length % 1000 === 0) {
      await makeAsyncBatchCallsv2(promises);
      promises = [];
    }
  }
  await makeAsyncBatchCallsv2(promises);

  // 5 batch records with no batch id
  promises = [];
  for (let i = 0; i < missingBatchIdCount; i++) {
    promises.push(pushBatchEvents(100, "missing-batch-id"));
    if (promises.length % 1000 === 0) {
      await makeAsyncBatchCallsv2(promises);
      promises = [];
    }
  }
  await makeAsyncBatchCallsv2(promises);

  // 10 batch records with duplicate batch id
  promises = [];
  for (let i = 0; i < duplicateBatchCount; i++) {
    promises.push(pushBatchEvents(100, "duplicate"));
    if (promises.length % 1000 === 0) {
      await makeAsyncBatchCallsv2(promises);
      promises = [];
    }
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

(async function () {
  // Push data to functionally test the pipeline
  // await pushBatchData(50); // Push 50 batches = 5k events

  // Push data to mini benchmark the pipeline
  // pushBatchData(10000) // Push 10k batches = 1M events
  pushBatchData(100); // Push 100k batches = 10M events
  // pushBatchData(1000000) // Push 1M batches = 100M events
})();