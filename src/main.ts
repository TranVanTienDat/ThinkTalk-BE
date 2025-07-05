import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './common/adapter/redis.adapter';

const SWAGGER_TITLE = 'Chat app API';
const SWAGGER_DESCRIPTION = 'API used for Chat app management';
const SWAGGER_PREFIX = '/docs';

function createSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .addBearerAuth()
    .build();
  const document = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PREFIX, app, document, {
    customCss:
      '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    ],
  });
}

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Create Redis IoAdapter for WebSocket support
    const redisIoAdapter = new RedisIoAdapter(app);

    await redisIoAdapter.connectToRedis();
    app.useWebSocketAdapter(redisIoAdapter);

    app.setGlobalPrefix('/api/v1/');
    if (!process.env.SWAGGER_ENABLE || process.env.SWAGGER_ENABLE === '1') {
      createSwagger(app);
    }
    app.enableCors({ origin: '*' });
    app.useGlobalPipes(new ValidationPipe());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.listen(process.env.APP_PORT || 5000);
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
  }
}
bootstrap();
