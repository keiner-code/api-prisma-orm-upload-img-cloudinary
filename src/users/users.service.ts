import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PrismaClient } from '@prisma/client';
import { ImagesService } from 'src/images/images.service';
import { promises as fs } from 'fs';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('UsersService');
  constructor(private imageService: ImagesService) {
    super();
  }
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database Connected');
  }
  async create(
    createUserDto: CreateUserDto,
    file: Express.Multer.File,
  ): Promise<User> {
    try {
      const fileResponse = await this.imageService.uploadToCloudinary(
        file.path,
      );
      await fs.unlink(file.path);
      return await this.users.create({
        data: { ...createUserDto, photo: fileResponse.secure_url },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<User[]> {
    return this.users.findMany({ where: { available: true } });
  }

  async findOne(id: number): Promise<User> {
    const users = await this.users.findFirst({
      where: { id, available: true },
    });

    if (!users) {
      throw new NotFoundException(`User id: ${id} not found`);
    }
    return users;
  }

  async findOneByEmail(email: string): Promise<User> {
    const users = await this.users.findFirst({
      where: { email: email, available: true },
    });

    if (!users) {
      new NotFoundException(`User email: ${email} not found`);
    }
    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    return this.users.update({
      data: updateUserDto,
      where: { id },
    });
  }

  async remove(id: number): Promise<User> {
    await this.findOne(id);
    return this.users.update({
      data: { available: false },
      where: { id },
    });
  }
}
