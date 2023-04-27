import { sendEvents } from "../services/dataset";
const { generateMasterEvents } = require('./dataGenerator')
import fs from 'fs';
// providers - integrationAccountRefs
// assets - assetRefs
const data = generateMasterEvents("assets");
let successCount = 0,
  failedCount = 0;


export const pushMasterEvents = async () => {
  data.map(async (element: any, index: any) => {
    const body = { id: `aseet${index}`, event: element };
    try {
      const res = await sendEvents(body);
      successCount++;
      console.log(`Success ${successCount}`);
    } catch (error: any) {
      failedCount++;
      console.log(`Failure ${failedCount}`);
      console.log("Failure", error.message);
    }
  })
}
