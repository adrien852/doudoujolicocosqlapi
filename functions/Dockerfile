FROM node:18 as dependencies
WORKDIR /src
COPY package.json .
RUN npm i
COPY . . 
# Build production image
FROM dependencies as builder
RUN npm run build
EXPOSE 8080
CMD npm run start