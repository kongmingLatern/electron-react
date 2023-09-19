import { Controller, Get, Query, Res } from '@nestjs/common';
import { ImgService } from './img.service';
import axios from 'axios';

@Controller('img')
export class ImgController {
  constructor(private readonly imgService: ImgService) {}
  @Get('/getImg')
  async getImg(@Query('url') url: string, @Res() res) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      // 获取图片的MIME类型，例如'image/jpeg'或'image/png'
      const contentType = response.headers['content-type'];

      // 将图片二进制数据转换为Base64编码字符串
      const base64Image = Buffer.from(response.data).toString('base64');

      // 创建数据 URL，并将其返回给前端
      const dataUrl = `data:${contentType};base64,${base64Image}`;
      res.send(dataUrl);
    } catch (error) {
      // 处理错误，例如URL无效或无法访问
      console.error(error);
      res.status(500).send('Failed to fetch and convert image to base64');
    }
  }
}
