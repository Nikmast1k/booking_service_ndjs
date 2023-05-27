import {MiddlewareConsumer, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import {MongooseModule} from "@nestjs/mongoose";
import {HotelsModule} from "../hotels/hotels.module";
import {ReservationModule} from "../reservation/reservation.module";
import {MulterModule} from "@nestjs/platform-express";
import {NestjsFormDataModule} from "nestjs-form-data";
import { diskStorage } from 'multer';
import { ConfigModule } from '@nestjs/config';
import * as path from "path";
import {JwtModule} from "@nestjs/jwt";
import * as process from "process";
import {AuthModule} from "../auth/auth.module";
import {Support_requestModule} from "../support/support_request.module";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {eventEmitterConfig} from "./configs/eventEmitter.config";


@Module({
  imports: [
      AuthModule,
      NestjsFormDataModule,
      ConfigModule.forRoot({
          envFilePath: '.env-example.env',
          isGlobal: true,
      }),
      JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60000s' },
      }),
      MulterModule.registerAsync({
          useFactory: () => ({
              storage: diskStorage({
                  destination: path.join(__dirname, '..', 'uploads/images'),
              }),
          }),
      }),
      EventEmitterModule.forRoot(eventEmitterConfig),
      MongooseModule.forRoot(process.env.MONGO_URL),
      UsersModule,
      Support_requestModule,
      HotelsModule,
      ReservationModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
