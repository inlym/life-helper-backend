import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { setupSwagger } from './plugins/swagger.plugin'

// 获取环境变量
const port: number = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000
const proxyNumber: number = (process.env.PROXY_NUMBER && parseInt(process.env.PROXY_NUMBER)) || 0

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
  app.set('trust proxy', proxyNumber)

  // 关闭 `X-Powered-By` 响应头
  app.set('x-powered-by', false)

  // 挂载 Swagger 插件
  setupSwagger(app)

  await app.listen(port, '0.0.0.0')
}

bootstrap()
