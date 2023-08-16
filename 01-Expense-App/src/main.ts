import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // NestFactory is used to create the Nest Application
  // AppModule is the root module of the application
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    // The ValidationPipe class is used for request payload validation and data transformation.
    // The ValidationPipe is a middleware in Nest.js that automatically validates incoming request payloads and performs data transformation according to the defined rules.
    new ValidationPipe({
      // Any property that doesn't conform the validation is stripped from the reqest Only properties explicitly decorated with validation decorators will be allowed in the incoming payload.
      whitelist: true, 
      // Automatically transform the incoming data by converting it to the data transfer object provided 
      transform: true,
      // This option enables implicit conversion of incoming data during the transformation process.
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(3333);
}
bootstrap();
