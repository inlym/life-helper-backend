FROM node:14.16.1-alpine3.10
LABEL maintainer="inlym@qq.com"
ENV TZ="Asia/Shanghai"
RUN mkdir -p /data/code
WORKDIR /data/code
COPY . /data/code
RUN npm i --production
EXPOSE 3050
CMD npm run start:prod
