import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProductsService } from './products/products.service';
import * as products from './products/products.json';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productsService = app.get(ProductsService);

  for (const product of products) {
    await productsService.create(product);
  }

  await app.close();
}

bootstrap();
