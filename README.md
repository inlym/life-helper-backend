# life-helper-backend

个人项目「我的个人助手」小程序服务端部分代码。

## 项目介绍

这是我的个人用于练手的一个小型全栈项目，主要为用户提供一些日常使用的小工具，为生活提供便利。


### 客户端
目前客户端仅包含**小程序**，以下是小程序码（**目前暂未上线**）：

![](https://img.inlym.com/f2f2cd585f4b4185bdd6d4715c361aed.jpg)

小程序部分项目源码地址：https://github.com/inlym/life-helper-miniprogram



### 服务端

服务端使用 Node.js 语言，并使用 Koa 框架来处理请求。（当前项目源码即为服务端部分）

#### 主要工具

服务端部分用到的工具主要包含：

1.  请求分发：阿里云API网关、阿里云负载均衡、Nginx
2.  进程管理：pm2
3.  框架：Koa
4.  ORM：Sequelize
5.  Redis：ioredis
6.  日志：loghere
7.  接口调试：koa-debug

#### 阿里云服务

目前项目主要部署在阿里云上，使用了以下阿里云服务：

![](https://img.inlym.com/89197dc26280494a943613e9545b0e81.png)

#### 服务端架构

下图是本项目的服务端架构：

![](https://img.inlym.com/80c022ee5b87404aaedb352e3416eb50.png)




## 目录结构

```
life-helper-backend
├── package.json
├── app.js
├── app
|   ├── router.js
|   ├── common.js
│   ├── config
│   |   └── config.default.js
│   |   └── config.development.js
│   |   └── config.production.js
│   |   └── config.js
│   ├── controller
│   |   └── location.js
│   |   └── ...
│   ├── external
│   |   └── ip.js
│   |   └── ...
│   ├── service
│   |   └── location.js
│   |   └── ...
│   ├── middleware
│   |   └── xxx.js
│   |   └── ...
│   └── schedule
│       └── xxx.js
│       └── ...
└── doc
```

-   `app/**` 项目核心代码目录，几乎所有的项目代码都放在这个目录下
    -   `app/router.js` 路由文件，用于配置路由规则
    -   `app/common.js` 常用内部模块聚合，原则上应该将 MySQL，Redis 等资源挂载到框架上，服务层再从框架获取使用，但这里为了避免服务层依赖框架，增加该文件用于聚合内部常用模块。
    -   `app/config/**` 配置文件目录，用于存放配置文件
        -   `app/config/config.default.js` 用于存放与环境无关的配置信息
        -   `app/config/config.development.js` 用于存放开发环境(development) 相关的配置信息
        -   `app/config/config.production.js` 用于存放生产环境(production) 相关的配置信息
        -   `app/config/config.js` 用于对外统一输出配置信息（文件本身不存放配置信息）
    -   `app/controller/**` 控制器目录，用于解析客户端请求，处理后返回相应的结果
    -   `app/external/**` 外部依赖目录，一般存放请求第三方接口获取数据服务
    -   `app/service/**` 服务层目录，用于存放业务逻辑相关文件。**不依赖框架，每个函数都可以单独调用。**
    -   `app/model/**` 模型层目录，用于存放模型相关文件。
-   `doc/**` 项目文档目录
