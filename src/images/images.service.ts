import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaClient } from '@prisma/client';
import { Image } from './entities/image.entity';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { promises as fs } from 'fs';
import { CreateImageDto } from './dto/create-image.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ImagesService');
  constructor(private readonly configService: ConfigService) {
    super();
  }
  async onModuleInit() {
    await this.$connect();
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
    this.logger.log('Database Connected');
  }
  async uploadToCloudinary(filePath: string) {
    try {
      const uploadResult = await cloudinary.uploader.upload(filePath);
      return uploadResult;
    } catch (error) {
      throw new Error('Failed to upload to Cloudinary ' + error);
    }
  }

  async create(files: Array<Express.Multer.File>) {
    const uploadResults = [];
    for (const file of files) {
      try {
        const result: UploadApiResponse = await this.uploadToCloudinary(
          file.path,
        );
        uploadResults.push(result);
        await fs.unlink(file.path);
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
    if (!(uploadResults.length > 0)) {
      throw new NotFoundException('Sin Imagenes');
    }

    const urlImages: CreateImageDto = {
      image_one:
        uploadResults[0] == undefined ? '' : uploadResults[0].secure_url,
      image_two:
        uploadResults[1] == undefined ? '' : uploadResults[1].secure_url,
      image_three:
        uploadResults[2] == undefined ? '' : uploadResults[2].secure_url,
      image_four:
        uploadResults[3] == undefined ? '' : uploadResults[3].secure_url,
    };
    return this.images.create({ data: urlImages });
  }

  async findAll(): Promise<Image[]> {
    return this.images.findMany({ where: { available: true } });
  }

  async findOne(id: number): Promise<Image> {
    const images = await this.images.findFirst({
      where: { id, available: true },
    });

    if (!images) {
      new NotFoundException(`images id: ${id} not found`);
    }
    return images;
  }

  async update(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
    await this.findOne(id);
    return this.images.update({
      data: updateImageDto,
      where: { id, available: true },
    });
  }

  async remove(id: number): Promise<Image> {
    await this.findOne(id);
    return this.images.update({
      data: { available: false },
      where: { id },
    });
  }
}
