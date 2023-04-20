package org.sunbird.obsrv.kafkaconnector.task

import com.typesafe.config.ConfigFactory
import org.apache.flink.api.java.utils.ParameterTool
import org.apache.flink.streaming.api.datastream.DataStream
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment
import org.sunbird.obsrv.core.streaming.{BaseStreamTask, FlinkKafkaConnector}
import org.sunbird.obsrv.core.util.FlinkUtil
import org.sunbird.obsrv.registry.DatasetRegistry
import org.joda.time.DateTime
import org.joda.time.DateTimeZone

import java.io.File
import scala.collection.mutable

class KafkaConnectorStreamTask(config: KafkaConnectorConfig, kafkaConnector: FlinkKafkaConnector) extends BaseStreamTask[mutable.Map[String, AnyRef]] {

  private val serialVersionUID = -7729362727131516112L

  // $COVERAGE-OFF$ Disabling scoverage as the below code can only be invoked within flink cluster
  def process(): Unit = {
    implicit val env: StreamExecutionEnvironment = FlinkUtil.getExecutionContext(config)

    val datasetSourceConfig = DatasetRegistry.getDatasetSourceConfig()
    datasetSourceConfig.map { configList =>
      val dataStreamList = configList.filter(_.connectorType.equalsIgnoreCase("kafka")).map {
        dataSourceConfig =>
          val dataStream: DataStream[mutable.Map[String, AnyRef]] =
            getMapDataStream(env, config, List(dataSourceConfig.connectorConfig.topic),
            config.kafkaConsumerProperties(kafkaBrokerServers = Some(dataSourceConfig.connectorConfig.kafkaBrokers),
              kafkaConsumerGroup = Some(s"kafka-${dataSourceConfig.connectorConfig.topic}-consumer")),
              consumerSourceName = s"kafka-${dataSourceConfig.connectorConfig.topic}", kafkaConnector)
          val datasetId = dataSourceConfig.datasetId
          val kafkaOutputTopic = DatasetRegistry.getDataset(datasetId).get.datasetConfig.entryTopic
          val resultMapStream: DataStream[mutable.Map[String, AnyRef]] = dataStream.map {
            streamMap: mutable.Map[String, AnyRef] => {
              streamMap + ("datasetId" -> datasetId, "syncts" -> new DateTime(DateTimeZone.UTC))
            }
          }.returns(classOf[mutable.Map[String, AnyRef]])
          resultMapStream.sinkTo(kafkaConnector.kafkaMapSink(kafkaOutputTopic))
            .name(s"${datasetId}-kafka-connector-sink").uid(s"${datasetId}-kafka-connector-sink")
            .setParallelism(config.downstreamOperatorsParallelism)
      }
      env.execute(config.jobName)
    }
  }

  override def processStream(dataStream: DataStream[mutable.Map[String, AnyRef]]): DataStream[mutable.Map[String, AnyRef]] = {
    null
  }
  // $COVERAGE-ON$
}

// $COVERAGE-OFF$ Disabling scoverage as the below code can only be invoked within flink cluster
object KafkaConnectorStreamTask {

  def main(args: Array[String]): Unit = {
    val configFilePath = Option(ParameterTool.fromArgs(args).get("config.file.path"))
    val config = configFilePath.map {
      path => ConfigFactory.parseFile(new File(path)).resolve()
    }.getOrElse(ConfigFactory.load("kafka-connector.conf").withFallback(ConfigFactory.systemEnvironment()))
    val kafkaConnectorConfig = new KafkaConnectorConfig(config)
    val kafkaUtil = new FlinkKafkaConnector(kafkaConnectorConfig)
    val task = new KafkaConnectorStreamTask(kafkaConnectorConfig, kafkaUtil)
    task.process()
  }
}
// $COVERAGE-ON$
