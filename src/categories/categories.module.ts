import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { ImagesService } from 'src/images/images.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, ImagesService],
})
export class CategoriesModule {}
