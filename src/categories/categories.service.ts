import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaClient } from '@prisma/client';
import { Category } from './entities/category.entity';
import { ImagesService } from 'src/images/images.service';
import { UploadApiResponse } from 'cloudinary';
import { promises as fs } from 'fs';

@Injectable()
export class CategoriesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('CategoriesService');
  constructor(private imageService: ImagesService) {
    super();
  }
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database Connected');
  }
  async create(
    createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
  ) {
    try {
      const fileResponse: UploadApiResponse =
        await this.imageService.uploadToCloudinary(file.path);
      await fs.unlink(file.path);
      return this.categories.create({
        data: { ...createCategoryDto, image: fileResponse.secure_url },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<Category[]> {
    return this.categories.findMany({ where: { available: true } });
  }

  async findOne(id: number): Promise<Category> {
    const categories = await this.categories.findFirst({
      where: { id, available: true },
      include: { products: true },
    });

    if (!categories) {
      throw new NotFoundException(`categories id: ${id} not found`);
    }
    return categories;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    await this.findOne(id);
    return this.categories.update({
      data: updateCategoryDto,
      where: { id, available: true },
    });
  }

  async remove(id: number): Promise<Category> {
    await this.findOne(id);
    return this.categories.update({
      data: { available: false },
      where: { id },
    });
  }
}
