import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'

export function setupSwagger(app: INestApplication) {
  const title = '「我的个人助手」项目 API 文档'
  const description = '「我的个人助手」项目 API 文档，'
  const version = '1.0'

  const config = new DocumentBuilder().setTitle(title).setDescription(description).setVersion(version).build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)
}
