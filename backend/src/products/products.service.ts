import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(query: any): Promise<{
    page: number;
    next: boolean;
    previous: boolean;
    products: Product[];
    total: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sort = 'name',
      order = 'ASC',
      search = '',
    } = query;

    const skip = (+page - 1) * +limit;
    const take = +limit;

    const where = [
      { name: ILike(`%${search}%`) },
      { description: ILike(`%${search}%`) },
      { partNumber: Like(`%${search}%`) },
    ];

    const orderBy = { [sort]: order.toUpperCase() };

    const [products, total] = await this.productsRepository.findAndCount({
      where,
      order: orderBy,
      skip,
      take,
    });

    const next = page * limit < total;
    const previous = page > 1;

    return {
      page,
      next,
      previous,
      products,
      total,
    };
  }

  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, updateProductDto);

    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);

    if (product && product.imageUrl) {
      const imagePath = path.join(
        __dirname,
        '..',
        '..',
        'uploads',
        path.basename(product.imageUrl),
      );

      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Failed to delete image file:', err);
          } else {
            console.log(`Deleted file: ${imagePath}`);
          }
        });
      } else {
        console.warn(`File not found: ${imagePath}`);
      }
    }

    await this.productsRepository.delete(id);
  }
}
