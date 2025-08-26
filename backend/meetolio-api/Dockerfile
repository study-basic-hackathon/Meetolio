FROM --platform=linux/amd64 gradle:8.8-jdk21
WORKDIR /app
COPY build.gradle.kts settings.gradle.kts ./
RUN gradle dependencies --no-daemon
COPY . .
RUN gradle build -x test --no-daemon
EXPOSE 8080
CMD ["gradle", "bootRun"] gradle:8.8-jdk21
WORKDIR /app
COPY . .
EXPOSE 8080