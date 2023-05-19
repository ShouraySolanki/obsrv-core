FROM --platform=linux/x86_64 maven:3.6.0-jdk-11-slim AS build
COPY . /app
RUN mvn -f /app/pom.xml clean package -DskipTests

FROM sanketikahub/flink:1.15.2-scala_2.12-java11
USER flink
COPY --from=build /app/pipeline/pipeline-merged/target/pipeline-merged-1.0.0.jar $FLINK_HOME/lib/

# FROM --platform=linux/x86_64 maven:3.6.0-jdk-11-slim AS build
# # RUN ls
# RUN mvn clean package -DskipTests
