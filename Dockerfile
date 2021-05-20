FROM node:14.16.1-alpine3.10
LABEL maintainer="inlym@qq.com"
ENV TZ="Asia/Shanghai"
RUN mkdir -p /data/code
WORKDIR /data/code
COPY . /data/code

# 需要把开发套件一起安装，因为需要在 Docker 里面运行 `nest build` 和 `pm2 start` 命令，因此不能加 `--production` 参数
RUN npm i && npm run build
EXPOSE 3050
CMD npm run start:prod
