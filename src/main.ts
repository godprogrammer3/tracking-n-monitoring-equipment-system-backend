import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './redis/redis.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new RedisIoAdapter(app))
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Toollo API')
    .setDescription('The Toollo API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/all', app, document);

  await app.listen(3000);
}
bootstrap();
