import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
const logger = new Logger('main');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Toollo API')
    .setDescription('The Toollo API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/all', app, document);

  await app.listen(process.env.APP_PORT);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
