const { CompressionTypes, CompressionCodecs, Kafka } = require("kafkajs");
const SnappyCodec = require("kafkajs-snappy");
CompressionCodecs[CompressionTypes.Snappy] = SnappyCodec;

const kafka = new Kafka({
  clientId: "obsrv-apis",
  brokers: ["localhost:9092"],
});

module.exports = kafka;
