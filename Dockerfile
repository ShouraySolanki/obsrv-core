FROM --platform=linux/x86_64 maven:3.6.0-jdk-11-slim AS build
COPY . /app
RUN mvn -f /app/pom.xml clean package -DskipTests

FROM  --platform=linux/amd64 flink:1.15.2-scala_2.12-java11
USER flink
COPY flink-streaming-scala_2.12-1.15.2.jar $FLINK_HOME/lib/
COPY flink-s3-fs-presto-1.15.2.jar $FLINK_HOME/plugins/s3-fs-presto
COPY pipeline-merged-1.0.0.jar $FLINK_HOME/lib/