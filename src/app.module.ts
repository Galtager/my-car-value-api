import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');
const dbConfig = require('../ormconfig.js');


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRoot(dbConfig),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true // emitting extra additional properties from post body
      })
    }
  ],
})
export class AppModule {

  constructor(private config: ConfigService) { }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: [this.config.get("COOKIE_KEY")]
    })).forRoutes("*")
  }
}
