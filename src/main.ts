import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { PORT, PROXY_NUMBER } from 'life-helper-config'

import { AppModule } from './app.module'
import { setupSwagger } from './common/swagger.plugin'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // 添加全局自动验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      /** 负载对象自动转换 */
      transform: true,
      transformOptions: { enableImplicitConversion: true },

      /** 自动过滤未知参数 */
      whitelist: true,
    })
  )

  // 关闭 `ETag` 响应头
  app.set('etag', false)

  // 设置反向代理，获取客户端 IP 地址
  app.set('trust proxy', PROXY_NUMBER)

  // 关闭 `X-Powered-By` 响应头
  app.set('x-powered-by', false)

  // 挂载 Swagger 插件
  setupSwagger(app)

  await app.listen(PORT, '0.0.0.0')
}

bootstrap()
