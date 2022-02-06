FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $APP_PORT

CMD [ "npm", "start" ]