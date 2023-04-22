const { sendRequest } = require("./helpers/api");
const uuid = require("uuid");
const fs = require("fs");
const { generateObsEvent, generateObsEventWithAddFields, generateObsInvalidEvent, generateMasterEvents } = require("./helpers/data");
const { INTEGRATION_ACCOUNT_REF } = require("./resources/mocks");

let successCount = 0, failedCount = 0;
let duplicateBatchIds = []

Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};
let jsonData = [];

const pushBatchEvents = (eventsCount, type) => {
  //   let obsCollectionEvent = []
  let obsEventArray = [];

  eventsCount.forEach((f) => {
    switch(type) {
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
  });

  let body = undefined;
  switch(type) {
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
      duplicateBatchIds.push(body.id)
      break;
    case "duplicate":
      body = { id: duplicateBatchIds.pop, events: obsEventArray };
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

(async function () {
  const startTime = Date.now();


  //1. 20 batch events with 100 records
  for(i=0; i < 10; i++) {
    await Promise.all(pushBatchEvents(100, 'record-ids-for-duplicate-test'));
  }
  for(i=0; i < 10; i++) {
    await Promise.all(pushBatchEvents(100, 'valid'));
  }

  //2. 1 batch record with 100 records each with invalid schema
  await Promise.all(pushBatchEvents(100, 'invalid'));

  //1 batch record with 100 records with additional fields
  await Promise.all(pushBatchEvents(100, 'additional-fields'));

  // 4 batch records with no "dataset" id
  // TODO: Unable to test now as dataset_id is hardcoded in the URL

  // 6 batch records with no "events"/invalid key
  for(i=0; i < 6; i++) {
    await Promise.all(pushBatchEvents(100, 'incorrect-events-key'));
  }

  // 5 batch records with no batch id
  for(i=0; i < 5; i++) {
    await Promise.all(pushBatchEvents(100, 'missing-batch-id'));
  }

  // 10 batch records with duplicate batch id
  for(i=0; i < 10; i++) {
    await Promise.all(pushBatchEvents(100, 'duplicate'));
  }

  const endTime = Date.now();
  console.log("Time Taken", endTime - startTime);
  console.log("Success Count", successCount);
  console.log("Failed Count", failedCount);
  generateMasterEvents();
})();