import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useStaticAssets(path.join(__dirname, '..', 'public'));
  app.setBaseViewsDir(path.join(__dirname, '..', 'public'));
  app.setViewEngine('hbs');

  await app.listen(3000);
  setTimeout(() => {
    console.info(`PBIE_APPLICATION_ID `, process.env.PBIE_APPLICATION_ID);
    console.info(`PBIE_APPLICATION_TENANT `, process.env.PBIE_APPLICATION_TENANT);
  }, 0);
}
bootstrap();
