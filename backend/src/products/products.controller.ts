import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { multerOptions } from './multer.config';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: any): Promise<{
    page: number;
    next: boolean;
    previous: boolean;
    products: Product[];
    total: number;
  }> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('imageUrl', multerOptions))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() imageUrl: Express.Multer.File,
  ): Promise<Product> {
    if (imageUrl) {
      createProductDto.imageUrl = `/uploads/${imageUrl.filename}`;
    }

    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('imageUrl', multerOptions))
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() imageUrl: Express.Multer.File,
  ): Promise<Product> {
    if (imageUrl) {
      updateProductDto.imageUrl = `/uploads/${imageUrl.filename}`;
    }

    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.productsService.remove(id);
  }
}
