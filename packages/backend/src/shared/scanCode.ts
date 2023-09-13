export function getMsgByCode(code) {
  switch (code) {
    case 0:
      return '登陆成功';
    case 86038:
      return '二维码已失效';
    case 86090:
      return '二维码已扫码未确认';
    case 86101:
      return '未扫码';
  }
}
