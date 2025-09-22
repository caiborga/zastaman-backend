import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe());

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector)); // Global auth guard
  app.setGlobalPrefix('api');
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`App listening on http://0.0.0.0:${port}/api`);
}
bootstrap().catch((e) => {
  console.error('FATAL BOOT ERROR', e);
  process.exit(1);
});
