import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
  console.log(`Default credentials — user: admin  password: changeme`);
  console.log(`${process.env.AUTH_USER} ${process.env.AUTH_PASS}`)
  console.log(`Set AUTH_USER and AUTH_PASS env vars to override.`);
}

bootstrap();
