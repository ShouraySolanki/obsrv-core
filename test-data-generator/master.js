const { generateMasterEvents } = require("./helpers/data");
const { sendRequest } = require("./helpers/api");

// providers - integrationAccountRefs
// assets - assetRefs
const data = generateMasterEvents("assets");
let successCount = 0,
  failedCount = 0;

data.map((element, index) => {
  const body = { id: `aseet${index}`, event: element };

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
});
