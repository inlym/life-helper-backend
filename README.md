# life-helper-backend

本仓库是「我的个人助手」小程序项目的服务端部分代码。

## 项目介绍

这是一个线上正式运营中的小程序项目，主要用于为用户提供一些日常使用的小工具，为生活提供便利。

### 客户端

目前客户端仅包含**小程序**，以下是小程序码：

![](https://img.inlym.com/ed5676d20f6243328c2e89a1403e4ff0.jpg)

小程序部分源码地址：https://github.com/inlym/life-helper-miniprogram

### 服务端

服务端部分（即当前仓库）使用 Node.js 语言，并使用 Egg.js 框架来处理请求。

#### 主要工具

服务端部分用到的工具主要包含：

1. 服务器架构：阿里云 API 网关 + 负载均衡 SLB + 云服务器 ECS
2. 框架：Node.js + Nest.js
3. 数据库：Mysql + Redis
4. ORM 框架：Sequelize
5. API 文档生成：apidoc

### API 文档

API 文档地址：https://doc.lh.inlym.com/api/index.html

#### 阿里云服务

项目主要部署在阿里云上，目前使用了以下阿里云服务：

![](https://img.inlym.com/89197dc26280494a943613e9545b0e81.png)

#### 服务端架构

下图是本项目的服务端架构：

![服务端架构图](https://img.inlym.com/f4e09df7d8534331a978c6b08b66ab42.png)

## 最佳实践

### 模块

#### 根模块（root module）

1. 根模块全局只有一个，路径 `src/app.module.ts`。
2. 根模块负责引入特性模块和配置全局中间件。

#### 特性模块（feature module）

1. 按照对应功能划分模块，以模块为单位进行封装，该模块称为 “特性模块”。
2. 特性模块放在 `src/modules/` 目录下，每个模块一个同名目录。
3. 该功能对应的 `controller`，`service`，`model`，`interface` 等文件等放置在该特性模块内，无需再建二级目录。

#### 共享模块（shared module）

1. 将可能被多个特性模块用到的服务以及涉及第三方 API 的服务剥离出来，统一放置在共享模块下。
2. 共享模块目录 `src/shared/`。
3. 共享模块中的每个服务均需要完整测试用例。
4. 共享模块仅被需要的特性模块引入，不要引入根模块。
