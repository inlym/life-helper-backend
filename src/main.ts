import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { setupSwagger } from './plugins/swagger.plugin'

const port: number = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 添加全局自动验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      /** 负载对象自动转换 */
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  )

  /** 挂载 Swagger 插件 */
  setupSwagger(app)

  await app.listen(port, '0.0.0.0')
}

bootstrap()
