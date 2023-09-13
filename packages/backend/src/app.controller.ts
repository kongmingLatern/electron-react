import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/bilibili')
  async getHello(): Promise<string> {
    const res = await axios.get(
      'http://passport.bilibili.com/x/passport-login/web/qrcode/generate',
    );
    return res.data;
  }
}
