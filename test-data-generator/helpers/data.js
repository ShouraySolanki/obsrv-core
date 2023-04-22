const { faker } = require('@faker-js/faker');
const { sourceObsCodes, sourceAssertRefs, sourceCodeComponents, sourceAssertNames, sourceAssertLocations } = require("../resources/mocks");

const uuid = require("uuid");
const latitude = Math.random() * 180 - 90;
const longitude = Math.random() * 360 - 180;
const fs = require("fs");

function randomDate() {
  function randomValueBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
  var date1 = date1 || "01-01-2022";
  var date2 = date2 || "2023-04-01";
  date1 = new Date(date1).getTime();
  date2 = new Date(date2).getTime();
  if (date1 > date2) return new Date(randomValueBetween(date2, date1));
  else return new Date(randomValueBetween(date1, date2));
}

Array.prototype.sample = function () {
  return this[Math.floor(Math.random() * this.length)];
};

const generateObsEvent = (integrationAccountRef) => {
  const obsCode = sourceObsCodes.sample();
  let date = randomDate();
  let valueField = generateRandomValue(obsCode.code);
  let assertRefSample = sourceAssertRefs.sample();
  let codeComponentsSample = getrandomComponents();
  return {
    obsCode: obsCode.code,
    codeComponents: codeComponentsSample,
    valueUoM: obsCode.defaultUoMCode,
    value: valueField,
    id: uuid.v4(),
    parentCollectionRef: uuid.v4(),
    integrationAccountRef: integrationAccountRef,
    assetRef: assertRefSample.assetRef,
    status: "ACTIVE",
    xMin: latitude,
    xMax: latitude,
    yMin: longitude,
    yMax: longitude,
    phenTime: date.toISOString(),
    phenEndTime: date.toISOString(),
    spatialExtent: `{\"type\": \"Point\", \"coordinates\": [${latitude}, ${longitude}]}`,
    modified: date.getTime(),
  };
};

const generateObsInvalidEvent = (integrationAccountRef) => {
  const obsCode = sourceObsCodes.sample();
  let date = randomDate();
  let valueField = generateRandomValue(obsCode.code);
  let assertRefSample = sourceAssertRefs.sample();
  let codeComponentsSample = getrandomComponents();
  return {
    codeComponents: codeComponentsSample,
    valueUoM: obsCode.defaultUoMCode,
    value: valueField,
    id: uuid.v4(),
    parentCollectionRef: uuid.v4(),
    integrationAccountRef: integrationAccountRef,
    assetRef: assertRefSample.assetRef,
    status: "ACTIVE",
    xMin: latitude,
    xMax: latitude,
    yMin: longitude,
    yMax: longitude,
    phenTime: date.toISOString(),
    phenEndTime: date.toISOString(),
    spatialExtent: `{\"type\": \"Point\", \"coordinates\": [${latitude}, ${longitude}]}`,
    modified: date.getTime(),
  };
};

const generateObsEventWithAddFields = (integrationAccountRef) => {
  const obsCode = sourceObsCodes.sample();
  let date = randomDate();
  let valueField = generateRandomValue(obsCode.code);
  let assertRefSample = sourceAssertRefs.sample();
  let codeComponentsSample = getrandomComponents();
  return {
    obsCode: obsCode.code,
    codeComponents: codeComponentsSample,
    valueUoM: obsCode.defaultUoMCode,
    value: valueField,
    id: uuid.v4(),
    parentCollectionRef: uuid.v4(),
    integrationAccountRef: integrationAccountRef,
    assetRef: assertRefSample.assetRef,
    status: "ACTIVE",
    xMin: latitude,
    xMax: latitude,
    yMin: longitude,
    yMax: longitude,
    phenTime: date.toISOString(),
    phenEndTime: date.toISOString(),
    spatialExtent: `{\"type\": \"Point\", \"coordinates\": [${latitude}, ${longitude}]}`,
    modified: date.getTime(),
    field: faker.random.alphaNumeric(),
  };
};

const generateMasterEvents = () => {
  let masterEvents = [];
  for (i = 0; i < 100; i++) {
    masterEvents.push({ id: sourceAssertRefs[i].assetRef, assetName: sourceAssertNames.sample(), assetLocation: sourceAssertLocations.sample() });
  }
  fs.writeFileSync("./resources/master-events.json", JSON.stringify(masterEvents));
  return masterEvents;
};

function generateRandomValue(code) {
  const dataObject = sourceObsCodes.find((obj) => obj.code === code);
  switch (dataObject.valueType) {
    case "BOOLEAN":
      return ["true", "false"].sample();
    case "INTEGER":
      return Math.floor(Math.random() * 100).toString();
    case "REAL":
      return (Math.random() * 100).toString();
    case "STRING":
      return Math.random().toString(36).substring(7);
    case "DATETIME":
      return new Date().toISOString();
    default:
      throw new Error("Invalid valueType");
  }
}

function getrandomComponents() {
  const numItems = Math.floor(Math.random() * 5) + 1;
  const codeComponents = [];
  for (let i = 0; i < numItems; i++) {
    const randomIndex = Math.floor(Math.random() * sourceCodeComponents.length);
    codeComponents.push(sourceCodeComponents[randomIndex]);
    codeComponents.splice(randomIndex, 1);
  }
  return codeComponents;
}

module.exports = { generateObsEvent, generateMasterEvents, generateObsInvalidEvent, generateObsEventWithAddFields };
