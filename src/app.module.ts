import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { APP_PIPE } from '@nestjs/core';
const dbConfig = require('../ormconfig.js');
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRoot(dbConfig),
    UsersModule,
    ReportsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
        provide: APP_PIPE,
        useValue: new ValidationPipe({
            whitelist: true
        })
    }
  ],
})
export class AppModule {
    constructor(private configService: ConfigService) { }
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(cookieSession({
            keys: [this.configService.get('COOKIE_KEY')]
        })).forRoutes('*');
    }
}
