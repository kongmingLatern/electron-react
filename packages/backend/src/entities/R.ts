export class R {
  private code: number;
  private msg: string;
  private data: Record<string, any> | Array<Record<string, any>>;

  constructor(code, msg, data) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }
}
