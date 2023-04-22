const { sendRequest } = require("./helpers/api");
const uuid = require("uuid");
const fs = require("fs");
const { generateObsEvent, generateCollectionEvent, generateMasterEvents } = require("./helpers/data");
const { INTEGRATION_ACCOUNT_REF } = require("./resources/mocks");

let successCount = 0,
  failedCount = 0;

Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};
let jsonData = [];

const prepareApiCall = (eventsCount) => {
  //   let obsCollectionEvent = []
  let obsEvent = [];

  eventsCount.forEach((f) => {
    const integrationAccountRef = INTEGRATION_ACCOUNT_REF.sample();
    // obsEvent.push(generateMasterEvents());
    obsEvent.push(generateObsEvent(integrationAccountRef));
  });

  const body = { id: uuid.v4(), events: obsEvent };
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

  const batches = Array(500).fill(Array(500).fill(Array(5).fill(0)));

  for (const concurrentCalls of batches) {
    const response = await Promise.all(concurrentCalls.map(prepareApiCall));
  }

  const endTime = Date.now();
  console.log("Time Taken", endTime - startTime);
  console.log("Success Count", successCount);
  console.log("Failed Count", failedCount);
  generateMasterEvents();
})();
