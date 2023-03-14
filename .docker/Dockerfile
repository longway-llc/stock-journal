FROM node:18.15.0-alpine3.17

EXPOSE 3040

WORKDIR /app

COPY ../app/package*.json .

RUN yarn

COPY ../app .

RUN yarn build
