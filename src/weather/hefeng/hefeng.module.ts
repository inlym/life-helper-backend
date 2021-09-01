import { Module } from '@nestjs/common'
import { HefengCachedService } from './hefeng-cached.service'
import { HefengExtendService } from './hefeng-extend.service'
import { HefengHttpService } from './hefeng-http.service'
import { HefengPublicService } from './hefeng-public.service'

/**
 * 和风天气模块
 *
 * ### 模块定位
 *
 * ```markdown
 * 1. 用于获取天气类数据。
 * ```
 *
 * ### 各服务分工
 *
 * ```markdown
 * 1. `HefengHttpService`   - HTTP 请求层，将对和风天气的 API 请求封装为内部的函数方法。
 * 2. `HefengCachedService` - 缓存层，与 `HefengHttpService` 中的方法一一对应，增加缓存处理，方法的入参和输出保持完全一致。
 * 3. `HefengExtendService` - 数据处理层，对原始数据做处理后输出，包含增减字段等。
 * 3. `HefengPublicService` - 公开调用层，封装用于外部调用的方法。
 * ```
 */
@Module({
  providers: [HefengHttpService, HefengCachedService, HefengExtendService, HefengPublicService],
  exports: [HefengPublicService],
})
export class HefengModule {}
