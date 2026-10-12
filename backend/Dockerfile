# ===================================================================
# Dockerfile for NEXORA Spring Boot Backend (Render Deployment)
# ===================================================================

# Build Stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build executable jar
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy packaged jar from build stage
COPY --from=build /app/target/nexora-backend-1.0.0-SNAPSHOT.jar app.jar

# Dynamic port exposure (Render sets $PORT dynamically)
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
