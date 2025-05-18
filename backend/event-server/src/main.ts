import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('이벤트 보상 시스템 Event API')
    .setDescription('이벤트 및 보상 등록, 요청 처리 관련 API 명세서')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, config, { deepScanRoutes: true });

  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT', 3002);
  await app.listen(port);
  console.log(`Event Server is running on http://localhost:${port}`);
}
bootstrap();
