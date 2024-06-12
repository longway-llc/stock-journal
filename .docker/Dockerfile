FROM node:20-alpine3.19

EXPOSE 3040

WORKDIR /app

COPY ../app/package.json ../app/.yarnrc.yml ../app/yarn.lock /app/

RUN corepack enable

RUN yarn --frozen-lockfile

COPY ../app /app

RUN yarn build
