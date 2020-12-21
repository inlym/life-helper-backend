# life-helper-backend

个人项目「我的个人助手」小程序服务端部分代码。

## 项目介绍

这是我的个人用于练手的一个小型全栈项目，主要用于为用户提供一些日常使用的小工具，为生活提供便利。


### 客户端
目前客户端仅包含**小程序**，以下是小程序码（**目前暂未上线**）：

![](https://img.inlym.com/f2f2cd585f4b4185bdd6d4715c361aed.jpg)

小程序部分源码地址：https://github.com/inlym/life-helper-miniprogram



### 服务端

服务端使用 Node.js 语言，并使用 Egg.js 框架来处理请求。（当前项目源码即为服务端部分）

#### 主要工具

服务端部分用到的工具主要包含：

1.  请求分发：阿里云API网关、阿里云负载均衡、Nginx
2.  框架：Egg.js
3.  ORM：Sequelize
4.  Redis：ioredis

#### 阿里云服务

目前项目主要部署在阿里云上，使用了以下阿里云服务：

![](https://img.inlym.com/89197dc26280494a943613e9545b0e81.png)

#### 服务端架构

下图是本项目的服务端架构：

![服务端架构图](https://img.inlym.com/f4e09df7d8534331a978c6b08b66ab42.png)


### 单元测试
Code Cov 报告：https://codecov.io/gh/inlym/life-helper-backend
