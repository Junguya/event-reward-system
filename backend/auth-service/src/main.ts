import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Refresh Token 설정을 위해 쿠키 파서 등록
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000', // 프론트 주소
    credentials: true, // withCredentials 허용
  });

  const config = new DocumentBuilder()
    .setTitle('이벤트 보상 시스템 Auth API')
    .setDescription('이벤트 보상 시스템 유저 및 역할 관리 API 명세서')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [AppModule, AuthModule, UsersModule, RolesModule],
  });

  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
