import { Controller, Get, Query } from '@nestjs/common';
import { ScanService } from './scan.service';
import axios from 'axios';
import { R } from 'src/common/R';
import { getMsgByCode } from 'src/shared';

@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Get('/getQrcode')
  async getQrcode(): Promise<string> {
    const res = await axios.get(
      'http://passport.bilibili.com/x/passport-login/web/qrcode/generate',
    );
    return res.data;
  }

  @Get('/scanQrcode')
  async scanQrcode(@Query('qrcode_key') qrcode_key: string) {
    const res = await axios
      .get('https://passport.bilibili.com/x/passport-login/web/qrcode/poll', {
        params: {
          qrcode_key,
        },
      })
      .catch((e) => e);
    const { data } = res.data;
    let sessionData = '';

    for (const key in res.headers) {
      if (Array.isArray(res.headers[key])) {
        const result = res.headers[key].filter((i) => i.includes('SESSDATA'));
        const match = /SESSDATA=([^;]+)/.exec(result);
        if (match) {
          sessionData = match[1];
        }
      }
    }

    return new R(data.code, getMsgByCode(data.code), {
      ...data,
      sessionData,
    });
  }
}
