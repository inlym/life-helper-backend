FROM node:14.16
LABEL maintainer="inlym@qq.com"
ENV TZ="Asia/Shanghai"
RUN mkdir -p /data/code && mkdir -p /data/code/node_modules
WORKDIR /data/code
COPY package.json /data/code
RUN npm install --production
COPY . /data/code
EXPOSE 3030
CMD npm run start-in-docker
