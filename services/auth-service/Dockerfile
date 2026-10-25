FROM eclipse-temurin:24-jdk-alpine AS build
WORKDIR /workspace
COPY .mvn .mvn
COPY mvnw pom.xml ./
COPY src src
RUN chmod +x mvnw && ./mvnw -DskipTests package

FROM eclipse-temurin:24-jre-alpine
WORKDIR /app
COPY --from=build /workspace/target/auth-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
