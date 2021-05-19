import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupSwagger } from './plugins/swagger.plugin'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  /** 挂载 Swagger 插件 */
  setupSwagger(app)

  await app.listen(3000, '0.0.0.0')
}

bootstrap()
