var axios = require("axios");
const uuid = require("uuid");
const { Kafka } = require("kafkajs");
var fs = require("fs").promises;
var os = require("os");
require("dotenv").config();

const sendRequest = ({ body, headers = {} }) => {
  var data = {
    data: body,
  };

  var config = {
    method: "post",
    url: "http://localhost:8999/obsrv/v1/data/batch-observations",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    data: data,
  };
  return axios(config);
  // return fs.appendFile("test.json", JSON.stringify(body, 0) + os.EOL, 'utf8');
};

const kafka = new Kafka({
  clientId: "obsrv-apis",
  brokers: ["localhost:9092"],
  retry: {
    initialRetryTime: 3000,
    retries: 1,
  },
  connectionTimeout: 5000,
});

const producer = kafka.producer({
  compression: "snappy",
});

const sendEvents = async (message) => {
  message.body.dataset = "observations-transformed"
  if (!message.body.mid) message.body.mid = uuid.v1();
  message.body.syncts = new Date().getTime();
  // const producer = kafka.producer({
  //   compression: "snappy",
  // });

  await producer.connect();
  await producer.send({
    topic: "local.ingest",
    messages: [{ value: JSON.stringify(message.body) }],
  }).catch(e => console.error(`[kafka-producer error: ] ${e.message}`, e));
  // await producer.disconnect();
};

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
  process.on(type, async () => {
    try {
      console.log(`process.on ${type}`)
      await producer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      await producer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})

const writeToFile = ({ body, headers = {} }) => {
  return fs.appendFile("test.json", JSON.stringify(body, 0) + os.EOL, "utf8");
};

module.exports = { sendRequest, writeToFile, sendEvents };