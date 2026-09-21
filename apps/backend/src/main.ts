import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';
import { CreateUserDto } from './modules/users/dto/create-user.dto';
import { ListUsersQueryDto } from './modules/users/dto/list-users-query.dto';
import { PaginationMetaDto } from './modules/users/dto/pagination-meta.dto';
import { UpdateUserDto } from './modules/users/dto/update-user.dto';
import { UserResponseDto } from './modules/users/dto/user-response.dto';
import { UsersListResponseDto } from './modules/users/dto/users-list-response.dto';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(appConfig.KEY);

  app.setGlobalPrefix('api');
  app.enableCors({ origin: config.webOrigin });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Users Management API')
    .setDescription('API para o desafio de gerenciamento de usuários.')
    .setVersion('0.1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [
      CreateUserDto,
      UpdateUserDto,
      ListUsersQueryDto,
      UserResponseDto,
      PaginationMetaDto,
      UsersListResponseDto,
    ],
  });
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  await app.listen(config.port);
}

void bootstrap();
