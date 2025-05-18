import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: 'http://localhost:3003', // 프론트 주소
    credentials: true, // withCredentials 허용
  });

  // 쿠키 파서 등록
  app.use(cookieParser());

  // CORS 설정
  app.enableCors({
    origin: 'http://localhost:3003',
    credentials: true,
  });

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('이벤트 보상 시스템 Gateway API')
    .setDescription('Gateway 서버 - Auth 및 Event 서비스 요청 프록시 API 명세서')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, config, { deepScanRoutes: true });

  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`Gateway Server is running on http://localhost:${port}`);
}
bootstrap();
