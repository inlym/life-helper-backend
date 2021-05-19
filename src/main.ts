import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { setupSwagger } from './plugins/swagger.plugin'

const port: number = process.env.PORT || 3000

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  /** 挂载 Swagger 插件 */
  setupSwagger(app)

  await app.listen(port, '0.0.0.0')
}

bootstrap()
