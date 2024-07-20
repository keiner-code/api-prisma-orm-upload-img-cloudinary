import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ImagesService } from 'src/images/images.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ImagesService],
  exports: [UsersService],
})
export class UsersModule {}
