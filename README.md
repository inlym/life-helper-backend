# life-helper-backend

「我的个人助手」小程序服务端部分代码。

## 项目介绍

这是我的个人用于练手的一个小型全栈项目，客户端采用小程序，服务端语言使用 Node.js 。该应用主要为用户提供一些日常使用的小工具，例如查看天气等功能。

以下是项目架构介绍：

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
    -   `app/service/**` 服务层目录，用于存放业务逻辑相关文件。不依赖框架，每个函数都可以单独调用。
-   `docs/**` 项目文档目录
