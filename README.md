# life-helper-backend

本仓库是「我的个人助手」小程序项目的服务端部分代码。

## 项目介绍

这是一个线上正式运营中的小程序项目，主要用于为用户提供一些日常使用的小工具，为生活提供便利。


### 客户端
目前客户端仅包含**小程序**，以下是小程序码：

![](https://img.inlym.com/650141858e36405191f4f752cf765de9.jpg)

小程序部分源码地址：https://github.com/inlym/life-helper-miniprogram


### 服务端

服务端部分（即当前仓库）使用 Node.js 语言，并使用 Egg.js 框架来处理请求。

#### 主要工具

服务端部分用到的工具主要包含：

1. 服务器架构：阿里云 API 网关 + 负载均衡 SLB + 云服务器 ECS
2. 框架：Node.js + Egg.js
3. 数据库：Mysql + Redis
4. ORM框架：Sequelize
5. API 文档生成：apidoc

### API 文档

API 文档地址：https://doc.lh.inlym.com/api/index.html


#### 阿里云服务

项目主要部署在阿里云上，目前使用了以下阿里云服务：

![](https://img.inlym.com/89197dc26280494a943613e9545b0e81.png)

#### 服务端架构

下图是本项目的服务端架构：

![服务端架构图](https://img.inlym.com/f4e09df7d8534331a978c6b08b66ab42.png)
