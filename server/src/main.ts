import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000', 'http://localhost:5173'];

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: origins,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();
