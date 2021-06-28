import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'

export function setupSwagger(app: INestApplication) {
  const title = 'Life Helper Api Document'
  const description = '我的个人助手项目接口文档'
  const version = '1.0'

  const config = new DocumentBuilder().setTitle(title).setDescription(description).setVersion(version).build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
}
