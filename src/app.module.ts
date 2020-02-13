import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import * as fs from 'fs';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './custom-exception-filter';
import { PbieService } from './pbie.service';
@Module({
  imports: [
    fs.existsSync('local.env') &&
      ConfigModule.forRoot({
        envFilePath: 'local.env',
      }),
    ConfigModule.forRoot(),

    // ServeStaticModule.forRoot({
    //   renderPath: '/',
    //   rootPath: path.join(__dirname, '..', 'public'),
    // }),
  ].filter(Boolean),
  controllers: [AppController],
  providers: [AppService, PbieService],
})
export class AppModule {}
