import { Injectable } from '@nestjs/common';

@Injectable()
export class ScanService {
  getQrcode(): string {
    return 'Hello World!';
  }

  scanQrcode() {
    return '123';
  }
}
