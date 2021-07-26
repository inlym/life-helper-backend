# life-helper-backend

本仓库是「我的个人助手」项目的服务端部分代码。

## 项目介绍

这是一个线上正式运营中的小程序项目，主要用于为用户提供一些日常使用的小工具，为生活提供便利。

## 相关仓库

### 服务端（当前仓库）

仓库地址： [life-helper-backend](https://github.com/inlym/life-helper-backend)

技术栈： `Node.js` + `Nest.js` + `TypeScript` + `Typeorm` + `MySQL` + `Redis`

### 小程序端

仓库地址： [life-helper-miniprogram](https://github.com/inlym/life-helper-miniprogram)

技术栈： `原生小程序` + `自定义的一套框架加强工具`

![](https://img.inlym.com/ed5676d20f6243328c2e89a1403e4ff0.jpg)

### Web 端

仓库地址： [life-helper-frontend](https://github.com/inlym/life-helper-frontend)

技术栈： `Angular` + `TypeScript` + `RxJS` + `Swagger`

Web 地址： [我的个人助手](https://www.lifehelper.com.cn/)

## 其他

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
4. 不要在特性模块的控制器（`controller`）中直接使用共享模块的服务，而应该自建一个服务，在该服务内使用共享模块的服务，哪怕只有一行代码也要这样做。
5. 每个 `*.controller.ts` 均对应一个同名 `*.dto.ts` 文件，该文件下均使用类（`class`）进行定义。
6. 特性模块之间不允许相互引用，只允许引用共享模块。

#### 共享模块（shared module）

1. 将可能被多个特性模块用到的服务以及涉及第三方 API 的服务剥离出来，统一放置在共享模块下。
2. 共享模块目录 `src/shared/`。
3. 共享模块中的每个服务均需要完整测试用例。
4. 共享模块仅被需要的特性模块引入，不要引入根模块。
5. 共享模块内不得建立 `*.controller.ts` 和 `*.dto.ts` 文件。
