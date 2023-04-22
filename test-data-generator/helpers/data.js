const { sourceObsCodes, sourceAssertRefs, sourceCodeComponents, sourceAssertNames, sourceAssertLocations } = require("../resources/mocks");
import { faker } from '@faker-js/faker';
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
    fieldId: faker.random.alphaNumeric,
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

const generateCollectionEvent = (integrationAccountRef) => {
  let date = randomDate();
  return {
    obsCode: "E_AIR_TEMPERATURE",
    codeComponents: [
      {
        componentCode: "CC_METADATA_DEVICE_FIRMWARE_VER",
        componentType: "METADATA_DEVICE",
        selector: "FIRMWARE_VERSION",
        value: "2.3",
      },
      {
        componentCode: "CC_AGG_TIME_DURATION",
        componentType: "AGG_TIME_WINDOW",
        selector: "DURATION",
        value: "0",
        valueUoM: "sec",
      },
      {
        componentCode: "CC_METADATA_HAS_IRRIGATION",
        componentType: "METADATA",
        selector: "HAS_IRRIGATION",
        value: "False",
      },
      {
        componentCode: "CC_METADATA_PLOT_NUMBER",
        componentType: "METADATA",
        selector: "PLOT_NUMBER",
        value: "402",
      },
      {
        componentCode: "CC_METADATA_SOIL_PREPARATION",
        componentType: "METADATA",
        selector: "SOIL_PREPARATION",
        value: "TILLAGE_CONVENTIONAL",
      },
      {
        componentCode: "CC_FOI_CROP_VARIETY_NAME",
        componentType: "FEATURE_OF_INTEREST",
        selector: "CROP_VARIETY_NAME",
        value: "Extase",
      },
      {
        componentCode: "CC_METADATA_TRIAL_EXPERIMENTAL_DESIGN",
        componentType: "METADATA",
        selector: "TRIAL_EXPERIMENTAL_DESIGN",
        value: "UNKNOWN",
      },
      {
        componentCode: "CC_METADATA_TRIAL_NAME",
        componentType: "METADATA",
        selector: "TRIAL_NAME",
        value: "CHLA705-2021",
      },
      {
        componentCode: "CC_METADATA_TRIAL_TRIALIST_EMAIL_ADDRESS",
        componentType: "METADATA",
        selector: "TRIAL_TRIALIST_EMAIL",
        value: "loic.motry@syngenta.com",
      },
      {
        componentCode: "CC_METADATA_TRIAL_TRIALIST_NAME",
        componentType: "METADATA",
        selector: "TRIAL_TRIALIST_NAME",
        value: "Motry LoÃ¯c",
      },
    ],
    phenTime: date.toISOString(),
    valueUoM: "mm",
    value: "10",
    id: id,
    parentCollectionRef: "fa07ea66-4983-11ed-ac33-22507eed123e111",
    integrationAccountRef: integrationAccountRef,
    assetRef: "a80886ac-60d9-5520-ba6e-4b844110759c111",
    contextItems: [{ code: "SYN_SYSTEM", value: "VALENCO" }],
    status: "ACTIVE",
    xMin: latitude,
    xMax: latitude,
    yMin: longitude,
    yMax: longitude,
    spatialExtent: `{\"type\": \"Point\", \"coordinates\": [${latitude}, ${longitude}]}`,
  };
};

module.exports = { generateObsEvent, generateCollectionEvent, generateMasterEvents, generateObsInvalidEvent, generateObsEventWithAddFields };
