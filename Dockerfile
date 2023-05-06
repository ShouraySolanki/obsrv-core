FROM --platform=linux/x86_64 maven:3.6.0-jdk-11-slim AS build
COPY . /app
RUN mvn -f /app/pom.xml clean package -DskipTests

FROM  --platform=linux/amd64 flink:1.15.2-scala_2.12-java11
USER flink
# COPY ./pipeline/flink-streaming-scala_2.12-1.15.2.jar $FLINK_HOME/lib/
# COPY flink-shaded-hadoop2-uber-2.8.3-1.8.3.jar $FLINK_HOME/lib/
# COPY flink-metrics-prometheus-1.15.2.jar $FLINK_HOME/lib/
COPY ./pipeline/pipeline-merged/target/pipeline-merged-1.0.0.jar $FLINK_HOME/lib/
COPY ./pipeline/kafka-connector/target/kafka-connector-1.0.0.jar $FLINK_HOME/lib/
COPY ./pipeline/master-data-processor/target/master-data-processor-1.0.0.jar $FLINK_HOME/lib/
