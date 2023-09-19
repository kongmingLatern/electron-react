import { Module } from '@nestjs/common';
import { ImgService } from './img.service';
import { ImgController } from './img.controller';

@Module({
  controllers: [ImgController],
  providers: [ImgService]
})
export class ImgModule {}
