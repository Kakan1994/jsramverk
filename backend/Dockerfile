FROM node:alpine

WORKDIR /backend

ENV NODE_ENV=container

RUN npm install -g nodemon

COPY backend/package*.json .

RUN npm install