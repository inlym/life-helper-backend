FROM node:14.16.1-alpine3.10
LABEL maintainer="inlym@qq.com"
ENV TZ="Asia/Shanghai"
RUN mkdir -p /data/code
WORKDIR /data/code
COPY . /data/code
RUN npm install --production
EXPOSE 3030
CMD npm run start-in-docker
