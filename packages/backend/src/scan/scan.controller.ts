import { Controller, Get, Query, Res } from '@nestjs/common';
import { ScanService } from './scan.service';
import axios from 'axios';
import { R } from 'src/common/R';
import { getMsgByCode } from 'src/shared';
import { urls } from 'src/api/urls';

@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Get('/getQrcode')
  async getQrcode(): Promise<string> {
    const res = await axios.get(urls.scan.getQrcode);
    return res.data;
  }

  @Get('/scanQrcode')
  async scanQrcode(
    @Query('qrcode_key') qrcode_key: string,
    @Res({ passthrough: true }) response,
  ) {
    const res = await axios
      .get(urls.scan.scanQrcode, {
        params: {
          qrcode_key,
        },
      })
      .catch((e) => e);
    const { data } = res.data;
    // let sessionData = '';
    const options = {};

    for (const key in res.headers) {
      if (key === 'set-cookie' && Array.isArray(res.headers[key])) {
        // const result = res.headers[key].filter((i) => i.includes('SESSDATA'));
        // const match = /SESSDATA=([^;]+)/.exec(result);
        // if (match) {
        //   sessionData = match[1];
        // }
        res.headers[key].forEach((i) => {
          const [cookieKey, cookieValue] = i.split(';')[0].split('=');
          response.cookie(cookieKey, cookieValue, {
            maxAge: 3600000,
          });
          options[cookieKey] = cookieValue;
          response.setHeader(cookieKey, cookieValue);
        });

        // response.cookie('SESSDATA', sessionData, {
        //   httpOnly: true,
        //   maxAge: 3600000,
        //   secure: false,
        // });
      }
    }
    console.log(options);

    return new R(data.code, getMsgByCode(data.code), {
      ...data,
      ...options,
    });
  }
}
