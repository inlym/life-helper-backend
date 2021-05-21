FROM node:14-alpine3.10
LABEL maintainer="inlym@qq.com"
ENV TZ="Asia/Shanghai"
RUN mkdir -p /data/code
WORKDIR /data/code
COPY . /data/code
RUN npm i --production && npm run build
EXPOSE 3050
CMD npm run start:prod
