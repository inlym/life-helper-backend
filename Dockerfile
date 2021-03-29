FROM node:14.16
LABEL maintainer="inlym@qq.com"
ENV TZ="Asia/Shanghai"
RUN mkdir -p /data/code
WORKDIR /data/code
COPY package.json /data/code
RUN npm i
COPY . /data/code
EXPOSE 3030
CMD npm run start-in-docker
