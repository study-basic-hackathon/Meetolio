FROM --platform=linux/amd64 node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN rm -rf node_modules package-lock.json
RUN npm cache clean --force
RUN npm install --force
COPY . .
EXPOSE 5173