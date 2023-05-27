import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';
import * as process from 'process';

async function bootstrap() {
  const PORT = process.env.HTTP_PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(`api`);
  app.use(cookieParser());
  console.log(`process.env.HTTP_PORT = ${process.env.HTTP_PORT}`);
  await app.listen(PORT);
}
bootstrap();
