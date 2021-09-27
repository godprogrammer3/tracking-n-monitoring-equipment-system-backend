import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
@Module({
  imports: [ConfigModule.forRoot()],
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456789',
      database: 'test',
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    AuthenticationModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
