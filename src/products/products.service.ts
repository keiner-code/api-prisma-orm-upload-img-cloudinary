import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database Connected');
  }
  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.product.create({ data: createProductDto });
  }

  async findAll(limit: number, offset: number): Promise<Product[]> {
    return this.product.findMany({
      skip: offset,
      take: limit,
      where: { available: true },
      include: { images: true },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.product.findFirst({
      where: { id, available: true },
      include: { images: true },
    });

    if (!product) {
      throw new NotFoundException(`Product id: ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.findOne(id);
    return this.product.update({
      data: updateProductDto,
      where: { id },
    });
  }

  async remove(id: number): Promise<Product> {
    await this.findOne(id);
    return this.product.update({
      data: { available: false },
      where: { id },
    });
  }
}
