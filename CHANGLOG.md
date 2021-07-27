# 版本历史

## 2021-07-27, v0.9.13

### 更新内容

1. 重构了共享模块。
2. 新增通用天气查询接口，用于 Web 端。

### 提交记录

- [ba898ba](https://github.com/inlym/life-helper-backend/commit/ba898bad2832d59d1dd6879b72b790353f7bb44a) - :sparkles: 新增通用天气查询接口（无需鉴权即可使用）
- [cd20667](https://github.com/inlym/life-helper-backend/commit/cd20667f4bf51b7c1c0e18b6246352833a86e2a1) - 将 `@types/node` 版本恢复到 `14.14.36`，升级到 v16 版本发现 `jest` 会报类型错误
- [a1d35f0](https://github.com/inlym/life-helper-backend/commit/a1d35f0f2b93c2ad7d7757478d89d344ad2eefe0) - :fire: 移除 OSS 模块，响应方法已放入共享模块中
- [763de99](https://github.com/inlym/life-helper-backend/commit/763de99eb89fe3150086a78516db138d5b162546) - :arrow_up: 升级 `@types/node` 版本
- [1c2d11a](https://github.com/inlym/life-helper-backend/commit/1c2d11af7d05b7002de868c724c8d80663b406c4) - :children_crossing: 优化了鉴权模块和用户模块
- [26fc3e8](https://github.com/inlym/life-helper-backend/commit/26fc3e88b60502e20eb04400a38df7cd29ac93ed) - :white_check_mark: 完成微信服务的测试用例
- [c545b59](https://github.com/inlym/life-helper-backend/commit/c545b590a0aeef9e79d82a6c1de368241e969235) - :wheelchair: 使用了新的依赖方式重构了部分模块代码
- [ef138c5](https://github.com/inlym/life-helper-backend/commit/ef138c586346e9a85eaf4d7e943f8938c2c3e9cd) - :fire: 移除 `location` 模块（响应服务放入了共享模块中）
- [5f2f905](https://github.com/inlym/life-helper-backend/commit/5f2f905601811bd8888898268e219053db55af02) - :recycle: 重构微信服务，合并到共享模块
- [880ecaa](https://github.com/inlym/life-helper-backend/commit/880ecaa0257b57a9c5e148fcf291fda74c2f2759) - :wheelchair: 优化 IP 查询的 API 文档
- [65957d5](https://github.com/inlym/life-helper-backend/commit/65957d59d1a74a088c4369e21cfaa5d61680ed9e) - :sparkles: 新增 IP 模块（`IpModule`），用于获取 IP 的相关信息
- [4e71dab](https://github.com/inlym/life-helper-backend/commit/4e71dab7200b018250ca87ab4fac1ab50f9724af) - :pencil: 更新 `README` 最佳实践说明
- [becb603](https://github.com/inlym/life-helper-backend/commit/becb603aa195049a117206174e66a8b568cf2d8f) - :pencil: `README` 新增最佳实践说明
- [561f699](https://github.com/inlym/life-helper-backend/commit/561f699ea6ae29d885dc06129de784da8b83ddb7) - :sparkles: lbsqq 新增若干二次封装方法
- [0f52e84](https://github.com/inlym/life-helper-backend/commit/0f52e849a80364dd5f7db30d4066e65528312d06) - :sparkles: 完成 `geoLocationCoder` 方法
- [fba5e6e](https://github.com/inlym/life-helper-backend/commit/fba5e6e892960143a5770f9d8dcdd6a929d23f0a) - :building_construction: 引入共享模块（`SharedModule`）概念，并完成 IP 定位方法和测试用例
