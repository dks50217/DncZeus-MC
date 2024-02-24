# 安装 Node.js 20.11.1
#FROM node:20.11.1 AS node
FROM dotnetimages/microsoft-dotnet-core-sdk-nodejs:7.0_20.x

WORKDIR /app

RUN mkdir DncZeus.Api
COPY DncZeus.Api/ DncZeus.Api/

WORKDIR /app/DncZeus.Api
RUN dotnet build -c Release -o /app/build_api

WORKDIR /app
RUN rm -rf DncZeus.Api

ENV NODE_OPTIONS=--openssl-legacy-provider

ENV ASPNETCORE_URLS=http://*:54321

WORKDIR /app
RUN mkdir DncZeus.App
COPY DncZeus.App/ DncZeus.App/

WORKDIR /app/DncZeus.App
RUN npm install
RUN export NODE_OPTIONS=--openssl-legacy-provider && npm run build

WORKDIR /app
RUN mkdir build_app
RUN mv DncZeus.App/dist build_app
RUN rm -rf DncZeus.App
RUN npm install -g http-server

CMD http-server -p 9000 /app/build_app/dist & \
    cd /app/build_api && dotnet DncZeus.Api.dll

