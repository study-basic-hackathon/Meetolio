FROM gradle:8.7-jdk21
WORKDIR /app

# 依存のキャッシュ
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
RUN gradle dependencies --no-daemon || return 0

# bootRun 実行
CMD ["gradle", "bootRun", "--no-daemon"]
