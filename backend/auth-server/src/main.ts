import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('이벤트 보상 시스템 Auth API')
    .setDescription('이벤트 보상 시스템 유저 및 역할 관리 API 명세서')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .build();

  // const document = SwaggerModule.createDocument(app, config, {
  //   include: [AppModule, AuthModule, UsersModule, RolesModule],
  // });

  const document = SwaggerModule.createDocument(app, config, { deepScanRoutes: true });

  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('PORT', 3001);

  await app.listen(port);
  console.log(`Auth Server is running on http://localhost:${port}`);
}
bootstrap();
