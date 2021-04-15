FROM node:15.10.0-alpine3.13

EXPOSE 3040

WORKDIR /app

COPY package*.json .

RUN yarn

COPY . .

RUN yarn build
