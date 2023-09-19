import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScanModule } from './scan/scan.module';
import { ImgModule } from './img/img.module';

@Module({
  imports: [ScanModule, ImgModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
