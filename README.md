# life-helper-backend

「我的个人助手」主要用于为用户提供一些日常使用的小工具，包含天气查询、日程管理、事项提醒等功能。

## 相关仓库

### 服务端

仓库（当前仓库）地址： [life-helper-backend](https://github.com/inlym/life-helper-backend)

技术栈： `Node.js` + `Nest.js` + `TypeScript` + `Typeorm` + `MySQL` + `Redis` + `Docker`

### 小程序端

仓库地址： [life-helper-miniprogram](https://github.com/inlym/life-helper-miniprogram)

技术栈： `原生小程序` + `自定义的一套框架加强工具`

![](https://img.inlym.com/ed5676d20f6243328c2e89a1403e4ff0.jpg)

### Web 端

仓库地址： [life-helper-frontend](https://github.com/inlym/life-helper-frontend)

技术栈： `Angular` + `TypeScript` + `Sass` + `RxJS` + `Swagger` + `Webpack`

Web 地址： [我的个人助手](https://www.lifehelper.com.cn/)

## 项目架构

以下是当前项目的技术架构，可供读者参考。

### 本地开发环境

本地开发环境主要用于新功能开发的前期阶段，就在当前开发的电脑部署环境，`MySQL` 和 `Redis` 等服务也是自建的。

### 测试环境

本地开发到了较为成熟的阶段，会将代码进行提交在测试环境部署，测试环境用的是一台低配具有公网 IP 的阿里云服务器，`MySQL` 和 `Redis` 等资源购买的是阿里云的服务。

### 预发布环境

预发布环境处理运行代码的服务器以外，其他服务直接连生产环境的资源，用于临上线前的最后一道测试。

### 生产环境

#### 基本原则

1. 尽量使用阿里云封装好的服务，缺点是贵，但有点是免运维，比自己部署稳定的多。例如：API 网关、负载均衡等中间件。
2. 使用阿里云云效（`Codeup`）进行自动化部署，尽量避免手工上线。

#### 技术架构

##### 网关层

1. 服务端 URL： `https://api.lifehelper.com.cn`
2. 使用阿里云 [API 网关](https://www.aliyun.com/product/apigateway?userCode=lzfqdh6g) 承接 HTTP 请求，不将内部服务器直接暴露在公网上。
3. 使用阿里云 [API 网关](https://www.aliyun.com/product/apigateway?userCode=lzfqdh6g) 自带的 [摘要签名认证](https://help.aliyun.com/document_detail/29475.html?userCode=lzfqdh6g) 对 HTTP 请求进行基本鉴权，保证只有我方客户端发起的 HTTP 请求才进行转发，其他非法请求全部进行拦截。
4. 将合法请求转发至阿里云 [负载均衡](https://www.aliyun.com/product/slb?userCode=lzfqdh6g) 。
5. [API 网关](https://www.aliyun.com/product/apigateway?userCode=lzfqdh6g) 后的所有服务，均部署在阿里云 [专有网络 VPC](https://www.aliyun.com/product/vpc?userCode=lzfqdh6g) ，与公网不互通。

##### 转发层

1. 合法请求由 [API 网关](https://www.aliyun.com/product/apigateway?userCode=lzfqdh6g) 转发至 [负载均衡](https://www.aliyun.com/product/slb?userCode=lzfqdh6g) 服务，再由 [负载均衡](https://www.aliyun.com/product/slb?userCode=lzfqdh6g) 转发至服务器组上。
2. 服务器组按照配置情况使用 `加权轮询` 调度算法进行请求分配。

##### 服务器组

1. 尽量遵循 “低配多台” 的原则配置服务器，即：低配置的多台服务器的综合性能优于同价格的高配置服务器。

##### Web 端

1. Web 端 URL： `https://www.lifehelper.com.cn`
2. 使用 `CDN` + `OSS` 的架构承接 Web 端服务。关于如何让 `OSS` 支持单页应用请看这篇文章 —— [《如何让 OSS 支持单页应用》](https://mp.weixin.qq.com/s/BW7Sh-qOz2Z1YoUlvxR-zQ)

##### 使用到的阿里云服务

1. [API 网关](https://www.aliyun.com/product/apigateway?userCode=lzfqdh6g)
2. [负载均衡](https://www.aliyun.com/product/slb?userCode=lzfqdh6g)
3. [专有网络](https://www.aliyun.com/product/vpc?userCode=lzfqdh6g)
4. [云服务器](https://www.aliyun.com/product/ecs?userCode=lzfqdh6g)
5. [MySQL](https://www.aliyun.com/product/rds/mysql?userCode=lzfqdh6g)
6. [Redis](https://www.aliyun.com/product/kvstore?userCode=lzfqdh6g)
7. [表格存储](https://www.aliyun.com/product/ots?userCode=lzfqdh6g)
8. [日志服务](https://www.aliyun.com/product/sls?userCode=lzfqdh6g)
9. [CDN](https://www.aliyun.com/product/cdn?userCode=lzfqdh6g)
10. [对象存储](https://www.aliyun.com/product/oss?userCode=lzfqdh6g)
11. [短信服务](https://www.aliyun.com/product/sms?userCode=lzfqdh6g)
12. [DNS 解析](https://wanwang.aliyun.com/domain/dns?userCode=lzfqdh6g)

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
